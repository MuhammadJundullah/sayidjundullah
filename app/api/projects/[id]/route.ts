import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else {
  throw new Error("CLOUDINARY_URL environment variable is required");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // `params` tidak lagi berupa Promise di Next.js 13+
) {
  const projectIdParam = params.id;

  // 1. Validasi Project ID dari Parameter URL
  // Sesuaikan tipe `projectId` ini dengan tipe `id` di `schema.prisma` Anda.
  // Misalnya, jika ID Anda adalah integer:
  let projectId: number;
  try {
    projectId = parseInt(projectIdParam);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID format. Must be a number." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid project ID format." },
      { status: 400 }
    );
  }

  // Jika ID Anda adalah UUID (String), gunakan ini sebagai gantinya:
  // const projectId: string = projectIdParam;
  // if (!projectId) {
  //   return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
  // }

  // 2. Autentikasi Pengguna
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const status = formData.get("status");
    const newPhoto = formData.get("photo") as File | null;

    // 3. Validasi Status Proyek
    if (!status || !["published", "archived"].includes(status.toString())) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Gunakan transaksi Prisma untuk memastikan semua operasi (DB dan Cloudinary) atomik.
    // Jika ada yang gagal, tidak ada perubahan yang akan disimpan.
    const updatedProject = await prisma.$transaction(async (tx) => {
      // 4. Ambil Proyek yang Sudah Ada untuk Mengecek Foto Lama
      const existingProject = await tx.projects.findUnique({
        where: { id: projectId },
        select: { photo: true }, // Hanya ambil kolom 'photo'
      });

      if (!existingProject) {
        // Jika proyek tidak ditemukan, lempar error yang akan ditangkap di luar transaksi
        throw new Error("Project not found");
      }

      let photoUrl: string | null = existingProject.photo; // Default: gunakan foto lama
      let publicIdToDelete: string | null = null;

      if (newPhoto && newPhoto.size > 0) {
        // Logika untuk upload foto baru dan menghapus yang lama
        if (existingProject.photo) {
          // Ekstrak public_id dari URL foto lama
          const urlParts = existingProject.photo.split("/");
          const fileNameWithExtension = urlParts[urlParts.length - 1];
          publicIdToDelete = fileNameWithExtension.split(".")[0];
        }

        // Upload foto baru ke Cloudinary
        const arrayBuffer = await newPhoto.arrayBuffer();
        const base64Photo = Buffer.from(arrayBuffer).toString("base64");
        const uploadResult = await cloudinary.uploader.upload(
          `data:${newPhoto.type};base64,${base64Photo}`,
          {
            folder: "projects", // Folder di Cloudinary
            invalidate: true, // Memastikan cache Cloudinary di-invalidasi
          }
        );

        photoUrl = uploadResult.secure_url;

        // Hapus foto lama jika ada
        if (publicIdToDelete) {
          await cloudinary.uploader
            .destroy(publicIdToDelete, { invalidate: true })
            .catch((err) =>
              console.error("Error deleting old photo from Cloudinary:", err)
            );
        }
      } else if (formData.has("photo") && formData.get("photo") === "null") {
        // Kasus: pengguna secara eksplisit mengirimkan "null" untuk menghapus foto
        // Ini adalah asumsi bagaimana client Anda akan mengindikasikan penghapusan foto.
        // Anda bisa sesuaikan dengan logika client Anda (misal: "delete" string, dll.)
        if (existingProject.photo) {
          const urlParts = existingProject.photo.split("/");
          const fileNameWithExtension = urlParts[urlParts.length - 1];
          publicIdToDelete = fileNameWithExtension.split(".")[0];
          await cloudinary.uploader
            .destroy(publicIdToDelete, { invalidate: true })
            .catch((err) =>
              console.error("Error deleting photo from Cloudinary:", err)
            );
          photoUrl = null; // Setel foto ke null di database
        }
      }
      // Jika `newPhoto` tidak ada dan bukan instruksi hapus eksplisit, `photoUrl` tetap menggunakan foto lama (`existingProject.photo`)

      // 5. Perbarui Proyek di Database Menggunakan Prisma
      const updatedProjectData = await tx.projects.update({
        where: {
          id: projectId, // Pastikan tipe `id` cocok (Int atau String UUID)
        },
        data: {
          status: status.toString(), // Pastikan status adalah string yang benar
          photo: photoUrl, // `photoUrl` bisa string URL atau null
        },
        select: {
          id: true,
          judul: true,
          status: true,
          photo: true, // Pastikan `photo` juga dikembalikan dalam respons
        },
      });

      return updatedProjectData; // Mengembalikan hasil dari transaksi
    });

    // 6. Respon Sukses
    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error) {
    // 7. Penanganan Error Global
    console.error("Project update error:", error);

    // Menangani error spesifik dari Prisma, seperti "Record Not Found"
    if (error instanceof Error) {
      if ((error as any).code === "P2025") {
        // Prisma error code for "record not found"
        return NextResponse.json(
          { error: "Project not found." },
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

export async function PATCH(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 1. Autentikasi Token
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectIdParam = searchParams.get("statuschange");

    // 2. Validasi Project ID dari Search Params
    // Prisma biasanya bekerja dengan string UUID atau number INT, pastikan tipe datanya cocok dengan schema Anda
    // Jika ID Anda UUID, Anda tidak perlu isNaN(Number(projectIdParam))
    if (!projectIdParam) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Jika projectId Anda adalah number (INT), gunakan ini:
    const projectId = parseInt(projectIdParam);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );
    }

    // Jika projectId Anda adalah UUID (string), cukup gunakan projectIdParam langsung:
    // const projectId = projectIdParam;

    const { status } = await request.json();

    // 3. Validasi Status
    if (!["published", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // 4. Update Status Menggunakan Prisma
    // Perhatikan bahwa Prisma secara default sudah menangani transaksi dasar untuk operasi tunggal.
    // Jika Anda butuh transaksi kompleks dengan beberapa operasi, Anda bisa pakai prisma.$transaction.
    const updatedProject = await prisma.projects.update({
      where: {
        id: projectId, // Pastikan tipe `projectId` cocok dengan tipe `id` di schema Prisma Anda (Int atau String UUID)
      },
      data: {
        status: status, // Pastikan field `status` di model Project Anda di Prisma berjenis String atau Enum
      },
      select: {
        // Memilih kolom yang ingin dikembalikan, seperti `RETURNING` di SQL
        id: true,
        judul: true,
        status: true,
      },
    });

    // 5. Cek Hasil Update
    if (updatedProject) {
      return NextResponse.json({
        success: true,
        data: updatedProject,
        message: "Status updated successfully",
      });
    } else {
      // Prisma akan melempar error jika ID tidak ditemukan, jadi `updatedProject` tidak akan null
      // Namun, ini bisa jadi fallback atau untuk penanganan error spesifik jika Anda menggunakannya di luar try/catch
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
  } catch (error) {
    // Penanganan Error Prisma
    // PrismaClientKnownRequestError adalah error umum dari Prisma
    if (error instanceof Error) {
      console.error("Status update error:", error.message);
      // Anda bisa cek `error.code` untuk error spesifik Prisma
      // Contoh: if (error.code === 'P2025') { /* handle not found */ }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown status update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
