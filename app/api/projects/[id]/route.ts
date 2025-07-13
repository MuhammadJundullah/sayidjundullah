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
