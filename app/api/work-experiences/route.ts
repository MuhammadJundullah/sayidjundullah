import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const experiences = await prisma.experiences.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        company_name: true,
        position: true,
        duration: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        jobdesks: {
          select: { description: true },
        },
      },
    });

    const formatted = experiences.map((exp) => ({
      experience_id: exp.id,
      company_name: exp.company_name,
      position: exp.position,
      duration: exp.duration,
      type: exp.type,
      created_at: exp.createdAt,
      updated_at: exp.updatedAt,
      jobdesks: exp.jobdesks,
    }));

    return NextResponse.json(
      {
        message: "Work experiences fetched successfully.",
        success: true,
        data: formatted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching work experiences:", error);
    return NextResponse.json(
      {
        message: "Failed fetching work experiences",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi input
    const { company_name, position, duration, type, jobdesks } = body;

    if (!company_name || !position || !duration || !type) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: company_name, position, duration, type",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validasi jobdesks
    if (!jobdesks || !Array.isArray(jobdesks) || jobdesks.length === 0) {
      return NextResponse.json(
        {
          message: "Jobdesks must be a non-empty array",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validasi setiap jobdesk harus punya description
    const invalidJobdesks = jobdesks.some(
      (jd) => !jd.description || jd.description.trim() === ""
    );
    if (invalidJobdesks) {
      return NextResponse.json(
        {
          message: "Each jobdesk must have a valid description",
          success: false,
        },
        { status: 400 }
      );
    }

    // Create experience dengan jobdesks sekaligus menggunakan transaction
    const newExperience = await prisma.$transaction(async (tx) => {
      // Create experience terlebih dahulu
      const experience = await tx.experiences.create({
        data: {
          company_name,
          position,
          duration,
          type,
        },
      });

      // Create jobdesks yang terhubung dengan experience
      await tx.jobdesk.createMany({
        data: jobdesks.map((jd: { description: string }) => ({
          experiences_id: experience.id,
          description: jd.description,
        })),
      });

      // Fetch experience dengan jobdesks
      return await tx.experiences.findUnique({
        where: { id: experience.id },
        select: {
          id: true,
          company_name: true,
          position: true,
          duration: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          jobdesks: {
            select: { description: true },
          },
        },
      });
    });

    if (!newExperience) {
      throw new Error("Failed to create experience");
    }

    const formatted = {
      experience_id: newExperience.id,
      company_name: newExperience.company_name,
      position: newExperience.position,
      duration: newExperience.duration,
      type: newExperience.type,
      created_at: newExperience.createdAt,
      updated_at: newExperience.updatedAt,
      jobdesks: newExperience.jobdesks,
    };

    return NextResponse.json(
      {
        message: "Work experience created successfully.",
        success: true,
        data: formatted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating work experience:", error);

    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          {
            message: "Duplicate entry detected",
            success: false,
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed creating work experience",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi input
    const { experience_id, company_name, position, duration, type, jobdesks } =
      body;

    if (!experience_id) {
      return NextResponse.json(
        {
          message: "Missing required field: experience_id",
          success: false,
        },
        { status: 400 }
      );
    }

    if (!company_name || !position || !duration || !type) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: company_name, position, duration, type",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validasi jobdesks jika ada
    if (jobdesks && (!Array.isArray(jobdesks) || jobdesks.length === 0)) {
      return NextResponse.json(
        {
          message: "Jobdesks must be a non-empty array if provided",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validasi setiap jobdesk harus punya description
    if (jobdesks) {
      const invalidJobdesks = jobdesks.some(
        (jd: any) => !jd.description || jd.description.trim() === ""
      );
      if (invalidJobdesks) {
        return NextResponse.json(
          {
            message: "Each jobdesk must have a valid description",
            success: false,
          },
          { status: 400 }
        );
      }
    }

    // Cek apakah experience exists
    const existingExperience = await prisma.experiences.findUnique({
      where: { id: experience_id },
    });

    if (!existingExperience) {
      return NextResponse.json(
        {
          message: "Work experience not found",
          success: false,
        },
        { status: 404 }
      );
    }

    // Update experience dengan jobdesks menggunakan transaction
    const updatedExperience = await prisma.$transaction(async (tx) => {
      // Update experience data
      await tx.experiences.update({
        where: { id: experience_id },
        data: {
          company_name,
          position,
          duration,
          type,
          updatedAt: new Date(),
        },
      });

      // Update jobdesks jika ada
      if (jobdesks) {
        // Delete jobdesks lama
        await tx.jobdesk.deleteMany({
          where: { experiences_id: experience_id },
        });

        // Create jobdesks baru
        await tx.jobdesk.createMany({
          data: jobdesks.map((jd: { description: string }) => ({
            experiences_id: experience_id,
            description: jd.description,
          })),
        });
      }

      // Fetch experience dengan jobdesks terbaru
      return await tx.experiences.findUnique({
        where: { id: experience_id },
        select: {
          id: true,
          company_name: true,
          position: true,
          duration: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          jobdesks: {
            select: { description: true },
          },
        },
      });
    });

    if (!updatedExperience) {
      throw new Error("Failed to update experience");
    }

    const formatted = {
      experience_id: updatedExperience.id,
      company_name: updatedExperience.company_name,
      position: updatedExperience.position,
      duration: updatedExperience.duration,
      type: updatedExperience.type,
      created_at: updatedExperience.createdAt,
      updated_at: updatedExperience.updatedAt,
      jobdesks: updatedExperience.jobdesks,
    };

    return NextResponse.json(
      {
        message: "Work experience updated successfully.",
        success: true,
        data: formatted,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating work experience:", error);

    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes("Record to update not found")) {
        return NextResponse.json(
          {
            message: "Work experience not found",
            success: false,
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed updating work experience",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experience_id = searchParams.get("experience_id");
    const jobdesk_id = searchParams.get("jobdesk_id");

    // Case 1: Delete specific jobdesk
    if (jobdesk_id) {
      const jobdeskIdNum = parseInt(jobdesk_id);

      if (isNaN(jobdeskIdNum)) {
        return NextResponse.json(
          {
            message: "Invalid jobdesk_id format",
            success: false,
          },
          { status: 400 }
        );
      }

      // Cek apakah jobdesk exists
      const existingJobdesk = await prisma.jobdesk.findUnique({
        where: { id: jobdeskIdNum },
        include: { experiences: true },
      });

      if (!existingJobdesk) {
        return NextResponse.json(
          {
            message: "Jobdesk not found",
            success: false,
          },
          { status: 404 }
        );
      }

      // Delete jobdesk
      await prisma.jobdesk.delete({
        where: { id: jobdeskIdNum },
      });

      return NextResponse.json(
        {
          message: "Jobdesk deleted successfully.",
          success: true,
          data: {
            deleted_jobdesk_id: jobdeskIdNum,
            experience_id: existingJobdesk.experiences_id,
          },
        },
        { status: 200 }
      );
    }

    // Case 2: Delete entire work experience
    if (experience_id) {
      const experienceIdNum = parseInt(experience_id);

      if (isNaN(experienceIdNum)) {
        return NextResponse.json(
          {
            message: "Invalid experience_id format",
            success: false,
          },
          { status: 400 }
        );
      }

      // Cek apakah experience exists
      const existingExperience = await prisma.experiences.findUnique({
        where: { id: experienceIdNum },
        include: {
          jobdesks: true,
        },
      });

      if (!existingExperience) {
        return NextResponse.json(
          {
            message: "Work experience not found",
            success: false,
          },
          { status: 404 }
        );
      }

      // Delete experience (jobdesks akan terhapus otomatis karena onDelete: Cascade)
      await prisma.experiences.delete({
        where: { id: experienceIdNum },
      });

      return NextResponse.json(
        {
          message: "Work experience deleted successfully.",
          success: true,
          data: {
            deleted_experience_id: experienceIdNum,
            deleted_jobdesks_count: existingExperience.jobdesks.length,
          },
        },
        { status: 200 }
      );
    }

    // Case 3: No parameter provided
    return NextResponse.json(
      {
        message: "Missing required parameter: experience_id or jobdesk_id",
        success: false,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error deleting data:", error);

    // Handle Prisma specific errors
    if (error instanceof Error) {
      if (error.message.includes("Record to delete does not exist")) {
        return NextResponse.json(
          {
            message: "Data not found",
            success: false,
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Failed deleting data",
        success: false,
      },
      { status: 500 }
    );
  }
}