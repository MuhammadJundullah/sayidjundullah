import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const educations = await prisma.educations.findMany({
      orderBy: { id: "desc" },
    });
    return new Response(JSON.stringify(educations), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
