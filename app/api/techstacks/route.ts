import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { v2 as cloudinary } from "cloudinary";
import { Prisma, PrismaClient } from "@prisma/client";
import { Readable } from "stream";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// streamToBuffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else {
  console.error("CLOUDINARY_URL environment variable is required");
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString() || "";
    const image = formData.get("image");
    const description = formData.get("description")?.toString() || "";

    let imageUrl;

    if (image instanceof File && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "/portofolio/techstacks" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageUrl = (uploadResult as any).secure_url || "default";
    }

    await prisma.techStack.create({
      data: {
        name: name,
        description: description,
        image: imageUrl,
      },
    });

    return NextResponse.json(
      {
        message: "Techstack created successfully.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: `Error creating Techstack: ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const filter = searchParams.get("filter");

    if (filter) {
      const selectClause = filter;

      const techStack = await prisma.techStack.findMany({
        select: { [selectClause]: true },
      });

      return NextResponse.json(
        {
          message: "TechStack fetched successfully.",
          success: true,
          data: techStack,
        },
        { status: 200 }
      );
    }

    if (!filter) {
      const techStack = await prisma.techStack.findMany();

      return NextResponse.json(
        {
          message: "TechStack fetched successfully.",
          success: true,
          data: techStack,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: `Failed fetching techStacks : ${error}`,
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    let id = searchParams.get("id");

    const newId = id != null ? parseInt(id, 10) : undefined;

    const techstackToDelete = await prisma.techStack.findUnique({
      where: {
        id: newId,
      },

      select: { image: true },
    });

    if (!techstackToDelete) {
      return NextResponse.json(
        {
          message: "Techstack not found",
          success: false,
        },
        { status: 404 }
      );
    }

    const imageUrl = techstackToDelete.image;

    if (imageUrl) {
      const match = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
      const publicId = match ? match[1] : null;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed remove photo on Cloudinary:", err);
        }
      }
    }

    await prisma.techStack.delete({
      where: {
        id: newId,
      },
    });

    return NextResponse.json(
      {
        message: "Delete techstack successfully.",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: `Failed delete techstack : ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const strId = searchParams.get("id");

    const id = strId ? parseInt(strId, 10) : NaN;

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "ID is required and must be a valid number." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const updateData: Prisma.TechStackUpdateInput = {};

    const fieldsToProcess: (keyof Prisma.TechStackUpdateInput)[] = ["name"];

    fieldsToProcess.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        updateData[field] = value.toString();
      }
    });

    const newImageFile = formData.get("image") as File | null;
    const deletePhotoExplicitly = formData.get("deleteImage") === "true";

    // MENCARI PROYEK TERLEBIH DAHULU SEBELUM TRANSAKSI
    const currentProject = await prisma.techStack.findUnique({
      where: { id: id },
    });

    if (!currentProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    let finalImageUrl: string | null = currentProject.image;
    let photoDeletionPublicId: string | null = null;
    let uploadResult = null;

    if (newImageFile && newImageFile.size > 0) {
      const buffer = await streamToBuffer(newImageFile.stream() as any);
      uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "/portofolio/techstacks" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      finalImageUrl = uploadResult.secure_url;

      if (currentProject.image) {
        const match = currentProject.image.match(/\/v\d+\/(.+)\.\w+$/);
        photoDeletionPublicId = match ? match[1] : null;
      }
    } else if (deletePhotoExplicitly && currentProject.image) {
      const match = currentProject.image.match(/\/v\d+\/(.+)\.\w+$/);
      photoDeletionPublicId = match ? match[1] : null;
      finalImageUrl = null;
    }

    const updatedTechStacksResult = await prisma.$transaction(async (tx) => {
      if (photoDeletionPublicId) {
        try {
          await cloudinary.uploader.destroy(photoDeletionPublicId);
        } catch (err) {
          console.error("Failed to delete old photo from Cloudinary:", err);
        }
      }

      // Memperbarui image hanya jika ada perubahan
      if (finalImageUrl !== currentProject.image) {
        updateData.image = finalImageUrl || "default";
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update or no changes detected.");
      }

      return tx.techStack.update({
        where: {
          id: currentProject.id,
        },
        data: updateData,
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    return NextResponse.json(
      {
        message: "TechStack updated successfully.",
        success: true,
        data: updatedTechStacksResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed update techstack:", error);
    return NextResponse.json(
      {
        message: `Failed update techstack : ${error}`,
      },
      { status: 500 }
    );
  }
}
