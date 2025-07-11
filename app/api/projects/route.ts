import pool from "@/lib/db";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

function jsonResponse(body: any, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else {
  throw new Error("CLOUDINARY_URL environment variable is required");
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const judul = formData.get("judul")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const desc = formData.get("desc")?.toString() || "";
    const status = formData.get("status")?.toString() || "";
    const url = formData.get("url")?.toString() || "";
    const tech = formData.get("tech")?.toString() || "";
    const site = formData.get("site")?.toString() || "";

    const photo = formData.get("photo");

    if (!judul || !category) {
      return NextResponse.json(
        { error: "Field 'judul' dan 'category' wajib diisi" },
        { status: 400 }
      );
    }

    let photoUrl: string | null = null;

    if (photo && photo instanceof File) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "projects" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      photoUrl = (uploadResult as any).secure_url;
    }

    const slug = judul.toLowerCase().replace(/\s+/g, "-");
    const categoryslug = category.toLowerCase().replace(/\s+/g, "-");

    await pool.query(
      `INSERT INTO projects 
      (judul, slug, category, categoryslug, url, tech, site, status, "desc", photo) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        judul,
        slug,
        category,
        categoryslug,
        url,
        tech,
        site,
        status,
        desc,
        photoUrl,
      ]
    );

    return NextResponse.json(
      { message: "Project berhasil dibuat" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error creating project: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    if (status && !["draft", "published", "archived"].includes(status)) {
      return jsonResponse({ error: "Invalid status value" }, 400);
    }

    let whereClause = {};

    if (status) {
      whereClause = { status };
    } else if (slug) {
      whereClause = { slug };
    } else if (category) {
      whereClause = { category };
    }

    const projectsData = await prisma.projects.findMany({
    where: whereClause,
      orderBy: [
        {
          status: {
            sort: 'desc',
          },
        },
      ],
    });


    if (!projectsData.length) {
      return jsonResponse({ message: "No projects found" }, 404);
    }

    return jsonResponse(projectsData, 200);
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return jsonResponse(
      { error: "Internal server error", details: error.message },
      500
    );
  }
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

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
        { error: "ID or slug parameter is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const updateData: Record<string, any> = {};

    const fieldsToProcess = [
      "judul",
      "slug",
      "category",
      "categoryslug",
      "url",
      "tech",
      "site",
      "desc",
      "status",
    ];

    fieldsToProcess.forEach((field) => {
      const value = formData.get(field);
      // Hanya tambahkan ke updateData jika nilainya tidak null
      // Jika Anda ingin mengabaikan string kosong, tambahkan `&& value !== ''`
      if (value !== null) {
        updateData[field] = value;
      }
    });

    // Validasi status (jika ada di updateData)
    if (
      updateData.status &&
      !["published", "archived"].includes(updateData.status.toString())
    ) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Jika ada file foto baru, upload ke Cloudinary dan hapus yang lama
    const newPhotoFile = formData.get("photo") as File | null;
    // Asumsi flag untuk menghapus foto secara eksplisit, misalnya dari client:
    // formData.append("deletePhoto", "true");
    const deletePhotoExplicitly = formData.get("deletePhoto") === "true";

    // Transaksi Prisma untuk memastikan atomisitas operasi DB dan Cloudinary
    const updatedProject = await prisma.$transaction(async (tx) => {
      let currentProject;
      // Temukan proyek berdasarkan ID atau slug
      if (idParam) {
        // Jika ID adalah INT:
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

      let finalPhotoUrl: string | null = currentProject.photo; // Default: pertahankan foto yang ada

      // Logika upload foto baru dan penghapusan foto lama
      if (newPhotoFile && newPhotoFile.size > 0) {
        // Upload foto baru
        const buffer = await streamToBuffer(newPhotoFile.stream() as any);
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "portfolio" }, // Folder di Cloudinary
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
          Readable.from(buffer).pipe(uploadStream);
        });
        finalPhotoUrl = uploadResult.secure_url; // Setel URL foto baru

        // Hapus foto lama jika ada dan berhasil diupload yang baru
        if (currentProject.photo) {
          try {
            const match = currentProject.photo.match(/\/v\d+\/(.+)\.\w+$/);
            const publicId = match ? match[1] : null;
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          } catch (err) {
            console.error("Failed to delete old photo from Cloudinary:", err);
            // Anda bisa memilih untuk melempar error di sini jika penghapusan foto lama kritis
            // atau cukup log dan lanjutkan jika upload foto baru lebih penting.
          }
        }
      } else if (deletePhotoExplicitly) {
        // Jika ada instruksi eksplisit untuk menghapus foto
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
        finalPhotoUrl = null; // Setel foto ke null di database
      }
      // Jika tidak ada `newPhotoFile` dan tidak ada `deletePhotoExplicitly`, `finalPhotoUrl` akan tetap sama dengan `currentProject.photo`

      // Tambahkan `photo` ke data update hanya jika `finalPhotoUrl` berbeda dari `currentProject.photo`
      if (finalPhotoUrl !== currentProject.photo) {
        updateData.photo = finalPhotoUrl;
      }

      // Jika tidak ada perubahan yang diminta, lempar error untuk menghasilkan respons 400
      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update or no changes detected.");
      }

      // Perbarui proyek di database
      const updatedProjectResult = await tx.projects.update({
        where: {
          id: currentProject.id, // Gunakan ID proyek yang ditemukan
        },
        data: updateData,
        select: {
          // Pilih semua kolom yang relevan untuk dikembalikan
          id: true,
          judul: true,
          slug: true,
          category: true,
          categoryslug: true,
          url: true,
          tech: true, // `tech` akan dikembalikan sebagai string
          site: true,
          desc: true,
          status: true,
          photo: true,
        },
      });

      return updatedProjectResult; // Mengembalikan hasil dari transaksi
    });

    // Respons sukses
    return NextResponse.json(
      {
        message: "Data berhasil diperbarui",
        status: "ok",
        data: updatedProject,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating project:", err);

    // Penanganan error dari Prisma (misal: P2025 untuk not found, atau lainnya)
    if (err instanceof Error) {
      if (
        (err as any).code === "P2025" ||
        err.message === "Project not found"
      ) {
        // Prisma not found atau pesan kustom
        return NextResponse.json({ error: "Data not found" }, { status: 404 });
      }
      if (err.message === "No valid fields to update or no changes detected.") {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      return NextResponse.json(
        { error: "Gagal memperbarui data", detail: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: "Gagal memperbarui data",
        detail: "Terjadi kesalahan server yang tidak diketahui.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 1. Autentikasi: Pastikan pengguna terotorisasi
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectIdParam = searchParams.get("statuschange");

    // 2. Validasi Project ID dari Search Params
    // Sesuaikan tipe data 'projectId' dengan yang Anda gunakan di schema.prisma
    // Jika ID Anda INT:
    const projectId = parseInt(projectIdParam || ""); // Gunakan '' jika null
    if (!projectIdParam || isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID format. Must be a number." },
        { status: 400 }
      );
    }
    // Jika ID Anda UUID (String):
    // const projectId = projectIdParam;
    // if (!projectId) {
    //   return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    // }

    const { status } = await request.json();

    // 3. Validasi Status: Pastikan status yang diberikan valid
    if (!["published", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 4. Perbarui status proyek menggunakan Prisma
    // Prisma secara otomatis menangani transaksi untuk operasi tunggal seperti ini.
    const updatedProject = await prisma.projects.update({
      where: {
        id: projectId, // Pastikan 'id' di schema.prisma Anda cocok dengan tipe 'projectId'
      },
      data: {
        status: status, // Pastikan 'status' di model Project Anda berjenis String atau Enum
      },
      select: {
        // Memilih kolom yang ingin dikembalikan, mirip 'RETURNING' di SQL
        id: true,
        judul: true,
        status: true,
      },
    });

    // 5. Kirim respons sukses jika proyek ditemukan dan diperbarui
    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "Status updated successfully",
    });
  } catch (error) {
    // 6. Penanganan error
    console.error("Status update error:", error);

    // PrismaClientKnownRequestError adalah error umum yang dilempar oleh Prisma
    // Misalnya, jika record dengan ID yang diberikan tidak ditemukan (P2025)
    if (error instanceof Error) {
      // Jika ID tidak ditemukan, Prisma melempar error dengan kode 'P2025'
      if ((error as any).code === "P2025") {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
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
    const slug = searchParams.get("slug");

    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Slug parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 1. Ambil data project (termasuk URL foto)
    const projectQuery = await pool.query(
      "SELECT photo FROM projects WHERE slug = $1",
      [slug]
    );

    if (projectQuery.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const photoUrl = projectQuery.rows[0]?.photo;

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

    // 3. Hapus data dari database
    const deleteQuery = await pool.query(
      "DELETE FROM projects WHERE slug = $1 RETURNING *",
      [slug]
    );

    if (deleteQuery.rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Failed to delete project" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Project berhasil dihapus",
        deletedProject: deleteQuery.rows[0],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error deleting project:", err);
    return new Response(
      JSON.stringify({
        error: "Gagal menghapus project",
        detail: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
