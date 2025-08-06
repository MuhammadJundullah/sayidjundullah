import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET() {
  try {
    const educations = await prisma.educations.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json({
      message: "Educations fetched successfully.",
      success: true,
      data: educations
      }, {status: 200}
    )
  } catch (error) {
    return NextResponse.json(`Error fetching educations : ${error}`)
  }
}
