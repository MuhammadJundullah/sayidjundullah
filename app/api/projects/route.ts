// app/api/projects/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient, Prisma } from "@prisma/client"; // Import Prisma untuk error handling
import { v2 as cloudinary } from "cloudinary"; // Import cloudinary (asumsi sudah dikonfigurasi)
import { Readable } from "stream"; // Diperlukan untuk streamToBuffer
import { any } from "zod";

// Inisialisasi Prisma Client (disarankan Singleton pattern di Next.js)
// Ini untuk mencegah masalah hot-reloading di development
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Konfigurasi Cloudinary
// Asumsi CLOUDINARY_URL sudah diatur di .env
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else {
  // Ini akan melempar error saat aplikasi dimulai jika env var tidak ada
  // Lebih baik dihandle dengan graceful shutdown atau pesan jelas
  console.error("CLOUDINARY_URL environment variable is required");
  // throw new Error("CLOUDINARY_URL environment variable is required");
}

// Helper function untuk mengkonversi stream ke buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Helper function untuk respons JSON (opsional, bisa diganti NextResponse.json)
// function jsonResponse(body: any, status: number) {
//   return new Response(JSON.stringify(body), {
//     status,
//     headers: { "Content-Type": "application/json" },
//   });
// }

// --- POST /api/projects (Membuat Project Baru) ---
export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const judul = formData.get("judul")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const desc = formData.get("desc")?.toString() || null; // Nullable
    const status = formData.get("status")?.toString() || null; // Nullable
    const url = formData.get("url")?.toString() || null; // Nullable
    const tech = formData.get("tech")?.toString() || null; // Nullable
    const site = formData.get("site")?.toString() || null; // Nullable

    const photo = formData.get("photo"); // File | string | null

    if (!judul.trim() || !category.trim()) {
      return NextResponse.json(
        { error: "Field 'judul' dan 'category' wajib diisi" },
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

    const slug = judul.toLowerCase().replace(/\s+/g, "-");
    const categoryslug = category.toLowerCase().replace(/\s+/g, "-");

    const newProject = await prisma.projects.create({
      data: {
        judul: judul,
        slug: slug,
        category: category,
        categoryslug: categoryslug,
        url: url,
        tech: tech,
        site: site,
        status: status,
        desc: desc,
        photo: photoUrl,
      },
    });

    return NextResponse.json(
      { message: "Project berhasil dibuat", project: newProject },
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
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const idParam = searchParams.get("id"); // Tambahkan parameter ID untuk GET by ID

    // Validasi status jika ada
    if (status && !["draft", "published", "archived"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    let whereClause: Prisma.ProjectsWhereInput = {}; // Tipe aman untuk where clause Prisma

    // Logika pencarian: ID > Slug > Category > Status
    if (idParam) {
      const projectId = parseInt(idParam);
      if (isNaN(projectId)) {
        return NextResponse.json(
          { error: "Invalid project ID format. Must be a number." },
          { status: 400 }
        );
      }
      whereClause = { id: projectId };
    } else if (slug) {
      whereClause = { slug };
    } else if (category) {
      whereClause = { category };
    } else if (status) {
      // Status adalah filter umum, bukan untuk detail spesifik
      whereClause = { status };
    }

    const projectsData = await prisma.projects.findMany({
      where: whereClause,
      orderBy: [
        {
          status: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    if (!projectsData.length) {
      if (idParam || slug) {
        return NextResponse.json(
          { message: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "No projects found" },
        { status: 404 }
      ); // Atau status 200 dengan []
    }

    return NextResponse.json(projectsData, { status: 200 });
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
    const slugParam = searchParams.get("slug");

    if (!idParam && !slugParam) {
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

    if (updateData.judul && typeof updateData.judul === "string") {
      updateData.slug = updateData.judul.toLowerCase().replace(/\s+/g, "-");
    }

    if (updateData.category && typeof updateData.category === "string") {
      updateData.categoryslug = updateData.category
        .toLowerCase()
        .replace(/\s+/g, "-");
    }

    const newPhotoFile = formData.get("photo") as File | null;
    const deletePhotoExplicitly = formData.get("deletePhoto") === "true";

    const updatedProject = await prisma.$transaction(async (tx) => {
      let currentProject;
      if (idParam) {
        const projectId = parseInt(idParam);
        if (isNaN(projectId)) {
          throw new Error("Invalid project ID format.");
        }
        currentProject = await tx.projects.findUnique({
          where: { id: projectId },
        });
      } else if (slugParam) {
        currentProject = await tx.projects.findUnique({
          where: { slug: slugParam },
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
          slug: true,
          category: true,
          categoryslug: true,
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

// --- PATCH /api/projects (Mengubah Status Project) ---
export async function PATCH(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectIdParam = searchParams.get("statuschange"); // Parameter ID untuk update status

    const projectId = parseInt(projectIdParam || "");
    if (!projectIdParam || isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID format. Must be a number." },
        { status: 400 }
      );
    }

    const { status } = await request.json();

    // Validasi Status: Pastikan status yang diberikan valid
    if (!["published", "archived", "draft"].includes(status)) {
      // Tambahkan 'draft' jika valid
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedProject = await prisma.projects.update({
      where: {
        id: projectId,
      },
      data: {
        status: status,
      },
      select: {
        id: true,
        judul: true,
        status: true,
        updatedAt: true, // Sertakan updatedAt untuk konfirmasi perubahan
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "Status updated successfully",
    });
  } catch (error: unknown) {
    // Gunakan unknown
    console.error("Status update error:", error);

    let errorMessage = "An unexpected server error occurred.";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record not found
        errorMessage = "Proyek tidak ditemukan.";
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
      { error: `Gagal memperbarui status: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// --- DELETE /api/projects (Menghapus Project) ---
export async function DELETE(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const idParam = searchParams.get("id"); // Tambahkan parameter ID untuk DELETE by ID

    if (!slug && !idParam) {
      return NextResponse.json(
        { error: "Slug atau ID parameter diperlukan untuk penghapusan" },
        { status: 400 }
      );
    }

    let whereClause: Prisma.ProjectsWhereUniqueInput | any = any;
    if (idParam) {
      const projectId = parseInt(idParam);
      if (isNaN(projectId)) {
        return NextResponse.json(
          { error: "Invalid project ID format." },
          { status: 400 }
        );
      }
      whereClause = { id: projectId };
    } else if (slug) {
      whereClause = { slug: slug };
    }

    // 1. Ambil data project (termasuk URL foto) sebelum dihapus
    const projectToDelete = await prisma.projects.findUnique({
      where: whereClause,
      select: { photo: true, id: true, slug: true, judul: true }, // Ambil juga ID/slug/judul untuk respons
    });

    if (!projectToDelete) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    const photoUrl = projectToDelete.photo;

    // 2. Hapus foto dari Cloudinary jika ada
    if (photoUrl) {
      const match = photoUrl.match(/\/v\d+\/(.+)\.\w+$/);
      const publicId = match ? match[1] : null;

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Gagal hapus foto dari Cloudinary:", err);
          // Lanjut proses hapus meskipun gagal hapus foto
        }
      }
    }

    // 3. Hapus data dari database menggunakan Prisma
    const deletedProject = await prisma.projects.delete({
      where: {
        id: projectToDelete.id, // Gunakan ID yang sudah ditemukan
      },
    });

    return NextResponse.json(
      {
        message: "Project berhasil dihapus",
        deletedProject: deletedProject,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Gunakan unknown
    console.error("Error deleting project:", error);

    let errorMessage = "Gagal menghapus project.";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        // Record not found (misal, sudah dihapus)
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
  }
}
