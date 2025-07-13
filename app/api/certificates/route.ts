// import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";

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

export async function GET() {
  try {
    const certificates = await prisma.certificates.findMany();
    return new Response(JSON.stringify(certificates), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // if (!token) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const desc = formData.get("desc")?.toString() || "";
    const date = formData.get("date")?.toString() || "";
    const site = formData.get("site")?.toString() || "";
    const status = formData.get("status")?.toString() || null;

    const schema = z.object({
      name: z.string().min(1, "Name wajib diisi"),
      desc: z.string().optional(),
      date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Format tanggal tidak valid",
      }),
      site: z.string().url("URL tidak valid"),
      status: z.string().nullable().optional(),
    });

    const parsed = schema.safeParse({ name, desc, date, site, status });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const photo = formData.get("photo");

    let photoUrl: string | null = null;

    if (photo instanceof File && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "/portofolio/certificates" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      photoUrl = (uploadResult as any).secure_url || null;
    }

    const newCertificate = await prisma.certificates.create({
      data: {
        name: name,
        desc: desc,
        site: site,
        date: date,
        photo: photoUrl,
        status: status,
      },
    });

    return NextResponse.json(
      { message: "Certificate berhasil dibuat", certificate: newCertificate },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating certificate:", error);

    let errorMessage =
      "Terjadi kesalahan yang tidak diketahui saat membuat sertifikat.";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target =
          (error.meta?.target as string[] | undefined)?.join(", ") ||
          "field(s)";
        errorMessage = `Gagal membuat sertifikat: nilai ${target} sudah ada. Harap gunakan nilai yang unik.`;
        if (target.includes("slug")) {
          errorMessage =
            "Judul sertifikat sudah ada. Harap gunakan judul lain.";
        }
      } else {
        errorMessage = `Kesalahan database (${error.code}): ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      { error: `Error creating certificate: ${errorMessage}` },
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
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (!idParam) {
      return NextResponse.json(
        { error: "Parameter ID diperlukan untuk penghapusan." },
        { status: 400 }
      );
    }

    const certificateId = parseInt(idParam);
    if (isNaN(certificateId)) {
      return NextResponse.json(
        { error: "Format ID certificate tidak valid." },
        { status: 400 }
      );
    }

    const certificateToDelete = await prisma.certificates.findUnique({
      where: {
        id: certificateId,
      },
      select: {
        id: true,
        photo: true,
      },
    });

    if (!certificateToDelete) {
      return NextResponse.json(
        { message: "Certificate tidak ditemukan." },
        { status: 404 }
      );
    }

    const photoUrl = certificateToDelete.photo;

    if (photoUrl) {
      const match = photoUrl.match(/\/v\d+\/(.+)\.\w+$/);
      const publicId = match ? match[1] : null;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Gagal hapus foto dari Cloudinary:", err);
        }
      }
    }

    const deletedCertificate = await prisma.certificates.delete({
      where: {
        id: certificateId,
      },
    });

    return NextResponse.json(
      {
        message: "Certificate berhasil dihapus.",
        deletedCertificate: deletedCertificate,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error menghapus certificate:", error);

    let errorMessage = "Gagal menghapus certificate.";
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        errorMessage = "Certificate tidak ditemukan atau sudah dihapus.";
        statusCode = 404;
      } else {
        errorMessage = `Kesalahan database (${error.code}): ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      { error: `Gagal menghapus certificate: ${errorMessage}` },
      { status: statusCode }
    );
  } finally {
    await prisma.$disconnect();
  }
}


