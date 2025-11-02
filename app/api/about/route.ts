import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { apiResponse, handleError } from "@/lib/api-utils";
import { z } from "zod";

const aboutSchema = z.object({
  about: z.string().min(1, "About is required"),
  what_i_do: z.string().min(1, "What I do is required"),
  role: z.string().min(1, "Role is required"),
});

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return handleError(null, "Unauthorized", 401);
  }

  try {
    const data = await req.formData();
    const about = data.get("about")?.toString() || "";
    const whatIDo = data.get("whatIDo")?.toString() || "";
    const role = data.get("role")?.toString() || "";

    const parsed = aboutSchema.safeParse({ about, what_i_do: whatIDo, role });

    if (!parsed.success) {
      return handleError(parsed.error.flatten().fieldErrors, "Invalid input", 400);
    }

    await prisma.about.create({
      data: {
        about: parsed.data.about,
        what_i_do: parsed.data.what_i_do,
        role: parsed.data.role,
      },
    });

    return apiResponse(true, null, "About created successfully.", 201);
  } catch (err) {
    return handleError(err, "Error creating about");
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return handleError(null, "Unauthorized", 401);
  }

  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return handleError(null, "ID is required in query parameters.", 400);
    }

    const data = await req.json();

    const parsed = aboutSchema.safeParse(data);

    if (!parsed.success) {
      return handleError(parsed.error.flatten().fieldErrors, "Invalid input", 400);
    }

    const about = await prisma.about.update({
      where: {
        id: parseInt(id),
      },
      data: {
        about: parsed.data.about,
        what_i_do: parsed.data.what_i_do,
        role: parsed.data.role,
      },
    });

    return apiResponse(true, about, "About updated successfully.", 200);
  } catch (err) {
    return handleError(err, "Error updating about");
  }
}

export async function GET(req: NextRequest) {
  try {
    const strId = req.nextUrl.searchParams.get("id") || "";

    if (!strId) {
      const data = await prisma.about.findMany();

      return apiResponse(true, data, "About fetched successfully.", 200);
    }

    const id = parseInt(strId, 10);

    const data = await prisma.about.findFirst({
      where: {
        id: id,
      },
    });

    if (!data) {
      return handleError(null, "Not found.", 404);
    }

    return apiResponse(true, data, "About fetched successfully.", 200);
  } catch (err) {
    return handleError(err, "Error fetching about");
  }
}