import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient, Prisma } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { any } from "zod";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else {
  console.error("CLOUDINARY_URL environment variable is required");
}

// streamToBuffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// checking validate UUID v4
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// --- POST /api/projects ---
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const judul = formData.get("judul")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const desc = formData.get("desc")?.toString() || null;
    const status = formData.get("status")?.toString() || null;
    const url = formData.get("url")?.toString() || null;
    const tech = formData.get("tech")?.toString() || null;
    const site = formData.get("site")?.toString() || null;
    const photo = formData.get("photo");

    if (!judul.trim() || !category.trim()) {
      return NextResponse.json(
        {
          message: "Field 'judul' & 'category' can't empty.",
          success: false,
        },
        { status: 400 }
      );
    }

    let photoUrl: string | null = null;

    if (photo instanceof File && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "/portofolio/projects" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      photoUrl = (uploadResult as any).secure_url || null;
    }

    await prisma.projects.create({
      data: {
        judul: judul,
        category: category,
        url: url,
        tech: tech,
        photo: photoUrl,
        site: site,
        status: status,
        desc: desc,
      },
    });

    return NextResponse.json(
      {
        message: "Project created successfully.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error creating project: ${error}` },
      { status: 500 }
    );
  }
}

// --- GET /api/projects ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    // 1. Validasi Input Status
    if (status && !["draft", "published", "archived"].includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status value. Must be 'draft', 'published', or 'archived'.",
        },
        { status: 400 }
      );
    }

    let whereClause: Prisma.ProjectsWhereInput = {};
    let selectClause: Prisma.ProjectsSelect | undefined = undefined;

    // uuid v4 validation
    function isValidUUID(uuid: string): boolean {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    }

    if (id) {
      if (id && !isValidUUID(id)) {
        return NextResponse.json(
          {
            message: "Invalid UUID.",
            success: false
          },
          { status: 400 }
        );
      }
      whereClause = { id };
    } else if (category) {
      whereClause = { category };
    } else if (status) {
      whereClause = { status };
    }

    selectClause = {
      id: true,
      judul: true,
      tech: true,
      photo: true,
      category: true,
      site: true,
      desc: true,
      url: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    };

    const projectsData = await prisma.projects.findMany({
      where: whereClause,
      orderBy: [
        {status: "desc"},
        {judul: "asc"},
      ],
      select: selectClause,
    });

    if (!projectsData.length) {
      return NextResponse.json(
        {
          message: "Project not found",
          success: false
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Projects fetched successfully",
        success: true,
        data: projectsData,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Internal server error", detail: error },
      { status: 500 }
    );
  }
}

// --- PUT /api/projects/:id ---
export async function PUT(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!req.body) {
    return NextResponse.json(
      { error: "Request body is required" },
      { status: 400 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "UUID id needed." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const updateData: Prisma.ProjectsUpdateInput = {};

    const fieldsToProcess: (keyof Prisma.ProjectsUpdateInput)[] = [
      "judul",
      "category",
      "url",
      "tech",
      "site",
      "desc",
      "status",
    ];

    fieldsToProcess.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) {
        updateData[field] = value.toString();
      }
    });

    if (
      updateData.status &&
      typeof updateData.status === "string" &&
      !["published", "archived", "draft"].includes(updateData.status)
    ) {
      return NextResponse.json(
        { error: "Status values is invalid." },
        { status: 400 }
      );
    }

    const newPhotoFile = formData.get("photo") as File | null;
    const deletePhotoExplicitly = formData.get("deletePhoto") === "true";

    const updatedProject = await prisma.$transaction(async (tx) => {
      let currentProject;
      if (idParam) {
        currentProject = await tx.projects.findUnique({
          where: { id: idParam },
        });
      }

      if (!currentProject) {
        throw new Error("Project not found");
      }

      let finalPhotoUrl: string | null = currentProject.photo;

      if (newPhotoFile && newPhotoFile.size > 0) {
        const buffer = await streamToBuffer(newPhotoFile.stream() as any);
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "/portofolio/projects" },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
            uploadStream.end(buffer);
        });
        finalPhotoUrl = uploadResult.secure_url;

        if (currentProject.photo) {
          const match = currentProject.photo.match(/\/v\d+\/(.+)\.\w+$/);
          const publicId = match ? match[1] : null;

          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.error("Failed delete photo from Cloudinary:", err);
            }
          }
        }
      } else if (deletePhotoExplicitly) {
        if (currentProject.photo) {
          try {
            const match = currentProject.photo.match(/\/v\d+\/(.+)\.\w+$/);
            const publicId = match ? match[1] : null;
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          } catch (err) {
            console.error(
              "Failed to delete photo explicitly from Cloudinary:",
              err
            );
          }
        }
        finalPhotoUrl = null;
      }

      if (
        finalPhotoUrl !== currentProject.photo ||
        (newPhotoFile && newPhotoFile.size > 0) ||
        deletePhotoExplicitly
      ) {
        updateData.photo = finalPhotoUrl;
      }

      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update or no changes detected.");
      }

      const updatedProjectResult = await tx.projects.update({
        where: {
          id: currentProject.id,
        },
        data: updateData,
        select: {
          id: true,
          judul: true,
          category: true,
          url: true,
          tech: true,
          site: true,
          desc: true,
          status: true,
          photo: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedProjectResult;
    });

    return NextResponse.json(
      {
        message: "Data berhasil diperbarui",
        status: "ok",
        data: updatedProject,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: `Failed update project: ${error}` },
      { status: 500 }
    );
  }
}

// --- PATCH /api/projects/:id ---
export async function PATCH(req: NextRequest) {
  const token = await getToken({
    req: req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid UUID format" },
        { status: 400 }
      );
    }

    const { status } = await req.json();

    if (!["published", "archived", "draft"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value." },
        { status: 400 }
      );
    }

    const updatedProject = await prisma.projects.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json(
      {
        message: "Status updated successfully.",
        success: true,
        data: updatedProject,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: `Gagal memperbarui status: ${error}` },
      { status: 400 }
    );
  }
}

// --- DELETE /api/projects/:id ---
export async function DELETE(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //
  // if (!token) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "UUID is needed." },
        { status: 400 }
      );
    }

    let whereClause: Prisma.ProjectsWhereUniqueInput | any = any;
    if (id) {
      whereClause = { id: id };
    }

    const projectToDelete = await prisma.projects.findUnique({
      where: whereClause,
      select: { photo: true, id: true },
    });

    if (!projectToDelete) {
      return NextResponse.json(
        {
          message: "Project not found",
          success: false
        },
        { status: 404 }
      );
    }

    const photoUrl = projectToDelete.photo;

    if (photoUrl) {
      const match = photoUrl.match(/\/v\d+\/(.+)\.\w+$/);
      const publicId = match ? match[1] : null;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed remove photo on Cloudinary:", err);
        }
      }
    }

    await prisma.projects.delete({
      where: {
        id: projectToDelete.id,
      },
    });

    return NextResponse.json(
      {
        message: "Project deleted successfully.",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed delete project: ${error}` },
      { status: 500 }
    );
  }
}
