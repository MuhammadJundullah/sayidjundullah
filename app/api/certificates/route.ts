import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const certificates = await prisma.certificates.findMany();
    return new Response(JSON.stringify(certificates), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
