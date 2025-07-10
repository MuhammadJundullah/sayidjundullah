import { NextRequest, NextResponse } from "next/server";
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

// export async function PUT(
//   request: NextRequest,
//    { params }: { params: { id: string } } 
// ) {
//   const projectIdParam = params.id;

//   console.log(projectIdParam);

//   let projectId: number;
//   try {
//     projectId = parseInt(projectIdParam);
//     if (isNaN(projectId)) {
//       return NextResponse.json(
//         { error: "Invalid project ID format. Must be a number." },
//         { status: 400 }
//       );
//     }
//   } catch {
//     return NextResponse.json(
//       { error: "Invalid project ID format." },
//       { status: 400 }
//     );
//   }

//   // 2. Autentikasi Pengguna
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const formData = await request.formData();
//     const status = formData.get("status");
//     const newPhoto = formData.get("photo") as File | null;

//     // 3. Validasi Status Proyek
//     if (!status || !["published", "archived"].includes(status.toString())) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 });
//     }

//     // Gunakan transaksi Prisma untuk memastikan semua operasi (DB dan Cloudinary) atomik.
//     // Jika ada yang gagal, tidak ada perubahan yang akan disimpan.
//     const updatedProject = await prisma.$transaction(async (tx) => {
//       // 4. Ambil Proyek yang Sudah Ada untuk Mengecek Foto Lama
//       const existingProject = await tx.projects.findUnique({
//         where: { id: projectId },
//         select: { photo: true }, // Hanya ambil kolom 'photo'
//       });

//       if (!existingProject) {
//         // Jika proyek tidak ditemukan, lempar error yang akan ditangkap di luar transaksi
//         throw new Error("Project not found");
//       }

//       let photoUrl: string | null = existingProject.photo; // Default: gunakan foto lama
//       let publicIdToDelete: string | null = null;

//       if (newPhoto && newPhoto.size > 0) {
//         // Logika untuk upload foto baru dan menghapus yang lama
//         if (existingProject.photo) {
//           // Ekstrak public_id dari URL foto lama
//           const urlParts = existingProject.photo.split("/");
//           const fileNameWithExtension = urlParts[urlParts.length - 1];
//           publicIdToDelete = fileNameWithExtension.split(".")[0];
//         }

//         // Upload foto baru ke Cloudinary
//         const arrayBuffer = await newPhoto.arrayBuffer();
//         const base64Photo = Buffer.from(arrayBuffer).toString("base64");
//         const uploadResult = await cloudinary.uploader.upload(
//           `data:${newPhoto.type};base64,${base64Photo}`,
//           {
//             folder: "projects", // Folder di Cloudinary
//             invalidate: true, // Memastikan cache Cloudinary di-invalidasi
//           }
//         );

//         photoUrl = uploadResult.secure_url;

//         // Hapus foto lama jika ada
//         if (publicIdToDelete) {
//           await cloudinary.uploader
//             .destroy(publicIdToDelete, { invalidate: true })
//             .catch((err) =>
//               console.error("Error deleting old photo from Cloudinary:", err)
//             );
//         }
//       } else if (formData.has("photo") && formData.get("photo") === "null") {
//         // Kasus: pengguna secara eksplisit mengirimkan "null" untuk menghapus foto
//         // Ini adalah asumsi bagaimana client Anda akan mengindikasikan penghapusan foto.
//         // Anda bisa sesuaikan dengan logika client Anda (misal: "delete" string, dll.)
//         if (existingProject.photo) {
//           const urlParts = existingProject.photo.split("/");
//           const fileNameWithExtension = urlParts[urlParts.length - 1];
//           publicIdToDelete = fileNameWithExtension.split(".")[0];
//           await cloudinary.uploader
//             .destroy(publicIdToDelete, { invalidate: true })
//             .catch((err) =>
//               console.error("Error deleting photo from Cloudinary:", err)
//             );
//           photoUrl = null; // Setel foto ke null di database
//         }
//       }
//       // Jika `newPhoto` tidak ada dan bukan instruksi hapus eksplisit, `photoUrl` tetap menggunakan foto lama (`existingProject.photo`)

//       // 5. Perbarui Proyek di Database Menggunakan Prisma
//       const updatedProjectData = await tx.projects.update({
//         where: {
//           id: projectId, // Pastikan tipe `id` cocok (Int atau String UUID)
//         },
//         data: {
//           status: status.toString(), // Pastikan status adalah string yang benar
//           photo: photoUrl, // `photoUrl` bisa string URL atau null
//         },
//         select: {
//           id: true,
//           judul: true,
//           status: true,
//           photo: true, // Pastikan `photo` juga dikembalikan dalam respons
//         },
//       });

//       return updatedProjectData; // Mengembalikan hasil dari transaksi
//     });

//     // 6. Respon Sukses
//     return NextResponse.json({ success: true, data: updatedProject });
//   } catch (error) {
//     // 7. Penanganan Error Global
//     console.error("Project update error:", error);

//     // Menangani error spesifik dari Prisma, seperti "Record Not Found"
//     if (error instanceof Error) {
//       if ((error as any).code === "P2025") {
//         // Prisma error code for "record not found"
//         return NextResponse.json(
//           { error: "Project not found." },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//     return NextResponse.json(
//       { error: "An unexpected server error occurred." },
//       { status: 500 }
//     );
//   }
// }

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
    const projectIdParam = searchParams.get("statuschange");

    if (!projectIdParam) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const projectId = parseInt(projectIdParam);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 400 }
      );
    }

    const { status } = await request.json();

    if (!["published", "archived"].includes(status)) {
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
      },
    });

    if (updatedProject) {
      return NextResponse.json({
        success: true,
        data: updatedProject,
        message: "Status updated successfully",
      });
    } else {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Status update error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error("Unknown status update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
