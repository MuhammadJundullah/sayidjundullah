import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const experiences = await prisma.experiences.findMany({
      orderBy: { id: "asc" },
      include: {
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
      jobdesks: exp.jobdesks.map((jd) => ({ description: jd.description })),
    }));

    return NextResponse.json(
        {
          message: "Work experiences fetched successfully.",
          success: true,
          data: formatted
        },
        {status: 200}
    )
  } catch (error) {
    return NextResponse.json(
        {
          message: `Failed fetching work experiences : ${error} `,
          success: false
        },
        {
          status: 500
        }
    )
  }
}
