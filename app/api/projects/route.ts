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

    const projectsData = await prisma.project.findMany({
      where: whereClause,
      
      orderBy: { id: "asc" },
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
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!req.body) {
    return new Response(JSON.stringify({ error: "Request body is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return new Response(
        JSON.stringify({ error: "ID or slug parameter is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const formData = await req.formData();
    const allowedFields = [
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
    const updateData: Record<string, any> = {};
    const setClauses: string[] = [];
    const values: any[] = [];

    // Ambil semua field selain foto
    allowedFields.forEach((field) => {
      const value = formData.get(field);
      if (value) {
        updateData[field] = value;
        const dbField = field === "desc" ? `"desc"` : field; // khusus "desc"
        setClauses.push(`${dbField} = $${setClauses.length + 1}`);
        values.push(value);
      }
    });

    // Jika ada file foto baru, upload ke Cloudinary dan hapus yang lama
    const newPhotoFile = formData.get("photo") as File | null;
    if (newPhotoFile && newPhotoFile.size > 0) {
      // Ambil foto lama
      const oldPhotoQuery = id
        ? await pool.query("SELECT photo FROM projects WHERE id = $1", [id])
        : await pool.query("SELECT photo FROM projects WHERE slug = $1", [
            slug,
          ]);

      const oldPhotoUrl = oldPhotoQuery.rows[0]?.photo;
      if (oldPhotoUrl) {
        const match = oldPhotoUrl.match(/\/v\d+\/(.+)\.\w+$/);
        const publicId = match ? match[1] : null;
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Gagal hapus foto lama:", err);
          }
        }
      }

      // Upload foto baru
      const buffer = await streamToBuffer(newPhotoFile.stream() as any);
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "portfolio" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        Readable.from(buffer).pipe(uploadStream);
      });

      const photoUrl = uploadResult.secure_url;
      updateData.photo = photoUrl;
      setClauses.push(`photo = $${setClauses.length + 1}`);
      values.push(photoUrl);
    }

    if (setClauses.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const setClause = setClauses.join(", ");
    let query = `UPDATE projects SET ${setClause} WHERE `;

    if (id) {
      query += `id = $${values.length + 1}`;
      values.push(id);
    } else {
      query += `slug = $${values.length + 1}`;
      values.push(slug);
    }

    query += " RETURNING *";
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "Data not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Data berhasil diperbarui", status: "ok" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error updating project:", err);
    return new Response(
      JSON.stringify({
        error: "Gagal memperbarui data",
        detail: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

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
