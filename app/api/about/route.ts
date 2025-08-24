import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.formData();
    console.log(data);
    const about = data.get("about")?.toString() || "";
    const whatIDo = data.get("whatIDo")?.toString() || "";
    const role = data.get("role")?.toString() || "";

    await prisma.about.create({
      data: {
        about: about,
        what_i_do: whatIDo,
        role: role,
      },
    });

    return NextResponse.json(
      {
        message: "About created successfully.",
        success: true,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log("Error create about: ", err);
    return NextResponse.json(
      { error: `Error creating project: ${err}` },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required in query parameters." },
        { status: 400 }
      );
    }

    const data = await req.json();

    if (!data.about || !data.what_i_do) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const about = await prisma.about.update({
      where: {
        id: parseInt(id),
      },
      data: {
        about: data.about,
        what_i_do: data.what_i_do,
        role: data.role,
      },
    });

    return NextResponse.json(
      {
        message: "About updated successfully.",
        success: true,
        data: about,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error updating about: ", err);
    return NextResponse.json(
      { error: `Error updating about: ${err}` },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    try {
      const strId = req.nextUrl.searchParams.get("id") || "";
      
      if (!strId) {
          const data = await prisma.about.findMany();

          return NextResponse.json(
            {
              message: "About fetched successfully.",
              success: true,
              data: data,
            },
            { status: 200 }
          );
      }

        const id = parseInt(strId, 10)

        const data = await prisma.about.findFirst({
            where: {
                id: id
            },
        })

        if (!data) {
             return NextResponse.json(
               {
                 message: "Not found.",
                 success: false,
               },
               { status: 404 }
             );
        }

        return NextResponse.json(
        {
            message: "About fetched successfully.",
            success: true,
            data: data
        },
        { status: 200 }
        );
    } catch (err) {
        console.log("Error updating about: ", err);
        return NextResponse.json(
        { error: `Error updating about: ${err}` },
        { status: 500 }
        );
    }


}