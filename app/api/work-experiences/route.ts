// app/api/work-experiences/route.js
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { id: "asc" },
      include: {
        jobdesks: {
          select: { description: true },
        },
      },
    });

    // Format jobdesks as array of descriptions
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

    return new Response(JSON.stringify(formatted), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
