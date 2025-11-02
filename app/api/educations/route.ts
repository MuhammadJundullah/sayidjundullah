import prisma from "@/lib/prisma";
import { apiResponse, handleError } from "@/lib/api-utils";

export async function GET() {
  try {
    const educations = await prisma.educations.findMany({
      orderBy: { id: "desc" },
    });
    return apiResponse(
      true,
      educations,
      "Educations fetched successfully.",
      200
    );
  } catch (error) {
    return handleError(error, "Error fetching educations");
  }
}
