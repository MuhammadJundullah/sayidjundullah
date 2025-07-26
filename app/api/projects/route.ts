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

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// --- F /api/projects (Membuat Project Baru) ---
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
          message: "Field 'judul' dan 'category' wajib diisi",
          status: "Gagal",
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

    const newProject = await prisma.projects.create({
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
        message: "Project berhasil ditambahkan",
        status: "Sukses",
        project: newProject,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating project:", error);

    let errorMessage =
      "Terjadi kesalahan yang tidak diketahui saat membuat proyek.";

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target =
          (error.meta?.target as string[] | undefined)?.join(", ") ||
          "field(s)";
        errorMessage = `Gagal membuat proyek: nilai ${target} sudah ada. Harap gunakan nilai yang unik.`;
        if (target.includes("slug")) {
          errorMessage = "Judul proyek sudah ada. Harap gunakan judul lain.";
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
      { error: `Error creating project: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// --- GET /api/projects (Mendapatkan Daftar/Detail Project) ---
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
    let orderByClause: Prisma.ProjectsOrderByWithRelationInput[] = [];
    let selectClause: Prisma.ProjectsSelect | undefined = undefined;

    // fungsi untuk validasi uuid v4 agar tidak error di database
    function isValidUUID(uuid: string): boolean {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    }

    // 2. Membangun whereClause berdasarkan prioritas
    if (id) {
      if (id && !isValidUUID(id)) {
        return NextResponse.json(
          { message: "UUID tidak valid.", status: "gagal" },
          { status: 400 }
        );
      }
      whereClause = { id };
    } else if (category) {
      whereClause = { category };
    } else if (status) {
      whereClause = { status };
      orderByClause.push({ status: "desc" }, { judul: "asc" });
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

    if (orderByClause.length === 0) {
      orderByClause.push({ status: "desc" }, { createdAt: "desc" });
    }

    // 3. Eksekusi Query Tunggal
    const projectsData = await prisma.projects.findMany({
      where: whereClause,
      orderBy: orderByClause,
      select: selectClause,
    });

    // 4. Penanganan Response Data
    if (!projectsData.length) {
      return NextResponse.json(
        { message: "Project tidak ditemukan", status: "Gagal" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Data proyek berhasil diambil",
        status: "Sukses",
        data: projectsData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching projects:", error);
    let errorMessage = "Internal server error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.json(
      { error: "Internal server error", detail: errorMessage },
      { status: 500 }
    );
  }
}

// --- PUT /api/projects (Memperbarui Project) ---
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
        { error: "ID atau slug parameter diperlukan untuk update" },
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
        { error: "Nilai status tidak valid" },
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
          Readable.from(buffer).pipe(uploadStream);
        });
        finalPhotoUrl = uploadResult.secure_url;

        if (currentProject.photo) {
          const match = currentProject.photo.match(/\/v\d+\/(.+)\.\w+$/);
          const publicId = match ? match[1] : null;

          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.error("Gagal hapus foto dari Cloudinary:", err);
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
    console.error("Error updating project:", error);

    let errorMessage = "Gagal memperbarui data.";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        errorMessage = "Proyek tidak ditemukan.";
        return NextResponse.json({ error: errorMessage }, { status: 404 });
      }
      if (error.code === "P2002") {
        const target =
          (error.meta?.target as string[] | undefined)?.join(", ") ||
          "field(s)";
        errorMessage = `Gagal memperbarui proyek: nilai ${target} sudah ada. Harap gunakan nilai yang unik.`;
      } else {
        errorMessage = `Kesalahan database (${error.code}): ${error.message}`;
      }
    } else if (error instanceof Error) {
      if (error.message === "Project not found") {
        return NextResponse.json(
          { error: "Proyek tidak ditemukan" },
          { status: 404 }
        );
      }
      if (
        error.message === "No valid fields to update or no changes detected."
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.json(
      { error: `Gagal memperbarui data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// --- PATCH /api/projects (Mengubah Status Project) ---
export async function PATCH(request: NextRequest) {
  // Autentikasi: Uncomment dan sesuaikan jika Anda menggunakan NextAuth
  // const token = await getToken({
  //   req: request,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });
  // if (!token) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // --- Perbaikan 1: Validasi ID harus untuk UUID, bukan number ---
    // Karena Anda beralih ke UUID, validasi harus memeriksa format UUID, bukan "must be a number".
    // Juga, jika id tidak ada, itu adalah bad request.
    if (!id || !isValidUUID(id)) {
      // Pastikan id ada DAN formatnya valid
      return NextResponse.json(
        { error: "Invalid project ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }
    // --- Akhir Perbaikan 1 ---

    const { status } = await request.json();

    if (!["published", "archived", "draft"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value." },
        { status: 400 }
      ); // Pesan lebih spesifik
    }

    const updatedProject = await prisma.projects.update({
      where: {
        id: id, // ID di sini harus string (UUID)
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
        message: "Status berhasil diperbarui.", // Konsistenkan pesan
        status: "success", // Gunakan 'success' atau boolean true, bukan 'Sukses' (string)
        data: updatedProject,
      },
      { status: 200 }
    ); // Tambahkan status 200 di sini, meskipun default
  } catch (error: unknown) {
    console.error("Status update error:", error);

    let errorMessage = "An unexpected server error occurred.";
    let statusCode = 500; // Default status code

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // P2025: An operation failed because it depends on one or more records that were required but not found.
        // Artinya, record dengan ID tersebut tidak ditemukan. Ini adalah 404.
        errorMessage = "Proyek tidak ditemukan.";
        statusCode = 404;
      } else if (error.code === "P2002") {
        // P2002: Unique constraint failed on the {constraint}
        // Jika ada unique constraint lain yang dilanggar saat update (jarang untuk update status)
        errorMessage = `Input duplikat: ${
          error.meta?.target || "kolom tidak diketahui"
        }.`;
        statusCode = 409; // Conflict
      } else if (error.code === "P2023") {
        // P2023: Inconsistent column data: {message}
        // Ini adalah error yang Anda alami sebelumnya untuk UUID tidak valid jika tidak divalidasi di awal.
        // Seharusnya sudah ter-handle di validasi awal, tapi sebagai fallback.
        errorMessage = "Kesalahan format ID atau data yang dikirim.";
        statusCode = 400; // Bad Request
      }
      // Tambahkan penanganan untuk error Prisma lain yang mungkin terjadi
      else {
        errorMessage = `Kesalahan database (${error.code}): ${error.message}`;
        statusCode = 500; // Default untuk error Prisma lainnya
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      { error: `Gagal memperbarui status: ${errorMessage}` },
      { status: statusCode }
    );
  } finally {
    // Penting: Pastikan koneksi Prisma diputuskan setelah setiap request
    // Terutama di serverless functions untuk menghindari hot/cold start issue
    await prisma.$disconnect();
  }
}

// --- DELETE /api/projects (Menghapus Project) ---
export async function DELETE(req: NextRequest) {
  // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // if (!token) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Slug atau ID parameter diperlukan untuk penghapusan" },
        { status: 400 }
      );
    }

    let whereClause: Prisma.ProjectsWhereUniqueInput | any = any;
    if (id) {
      whereClause = { id: id };
    }

    const projectToDelete = await prisma.projects.findUnique({
      where: whereClause,
      select: { photo: true, id: true, judul: true },
    });

    if (!projectToDelete) {
      return NextResponse.json(
        { message: "Project not found", Status: "Gagal" },
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
          console.error("Gagal hapus foto dari Cloudinary:", err);
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
        message: "Project berhasil dihapus",
        status: "Sukses",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error deleting project:", error);

    let errorMessage = "Gagal menghapus project.";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        errorMessage = "Proyek tidak ditemukan atau sudah dihapus.";
        return NextResponse.json({ error: errorMessage }, { status: 404 });
      } else {
        errorMessage = `Kesalahan database (${error.code}): ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.json(
      { error: `Gagal menghapus project: ${errorMessage}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
