import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import  pool  from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary dari environment variable
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true, 
  });
} else {
  throw new Error("CLOUDINARY_URL environment variable is required");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id  = (await params).id;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  try {
    const formData = await request.formData();
    const status = formData.get("status");
    const newPhoto = formData.get("photo") as File | null;

    // Validasi status
    if (!status || !["published", "archived"].includes(status.toString())) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const {
        rows: [existingProject],
      } = await client.query("SELECT photo FROM projects WHERE id = $1", [id]);

      let photoUrl = existingProject?.photo;
      let publicIdToDelete: string | null = null;

      // 2. Handle new photo upload
      if (newPhoto && newPhoto.size > 0) {
        // Extract public_id from old photo URL if exists
        if (existingProject?.photo) {
          const urlParts = existingProject.photo.split("/");
          const fileName = urlParts[urlParts.length - 1];
          publicIdToDelete = fileName.split(".")[0];
        }

        // Upload new photo to Cloudinary
        const arrayBuffer = await newPhoto.arrayBuffer();
        const uploadResult = await cloudinary.uploader.upload(
          `data:${newPhoto.type};base64,${Buffer.from(arrayBuffer).toString(
            "base64"
          )}`,
          {
            folder: "projects",
            invalidate: true,
          }
        );

        photoUrl = uploadResult.secure_url;

        // Delete old photo if exists
        if (publicIdToDelete) {
          await cloudinary.uploader
            .destroy(publicIdToDelete, {
              invalidate: true,
            })
            .catch(console.error);
        }
      }

      // 3. Update project in database
      const { rows } = await client.query(
        `UPDATE projects 
         SET status = $1, photo = COALESCE($2, photo) 
         WHERE id = $3 
         RETURNING id, judul, status, photo`,
        [status, photoUrl, id]
      );

      await client.query("COMMIT");

      return rows[0]
        ? NextResponse.json({ success: true, data: rows[0] })
        : NextResponse.json({ error: "Project not found" }, { status: 404 });
    } finally {
      await client.query("ROLLBACK").catch(() => {});
      client.release();
    }
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("statuschange");

    if (!projectId || isNaN(Number(projectId))) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const { status } = await request.json();
    if (!["published", "archived"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rows } = await client.query(
        `UPDATE projects 
         SET status = $1 
         WHERE id = $2 
         RETURNING id, judul, status`,
        [status, projectId]
      );

      await client.query("COMMIT");

      return rows[0]
        ? NextResponse.json({
            success: true,
            data: rows[0],
            message: "Status updated successfully",
          })
        : NextResponse.json({ error: "Project not found" }, { status: 404 });
    } finally {
      await client.query("ROLLBACK").catch(() => {});
      client.release();
    }
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
