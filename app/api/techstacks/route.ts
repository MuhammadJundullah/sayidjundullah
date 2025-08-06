import {PrismaClient} from "@prisma/client";
import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import { v2 as cloudinary } from "cloudinary";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        secure: true,
    });
} else {
    console.error("CLOUDINARY_URL environment variable is required");
}

export async function POST(req: NextRequest) {
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    if (!token) {
        return NextResponse.json({error: "Unauthorized."}, {status: 401})
    }

    try {
        const formData = await req.formData();
        const name = formData.get("name")?.toString() || "";
        const image = formData.get("image");

        let imageUrl;

        if (image instanceof File && image.size > 0) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "/portofolio/techstacks" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(buffer);
            });

            imageUrl = (uploadResult as any).secure_url || null;
        }

        const newTechStack = await prisma.techStack.create({
            data: {
                name: name,
                image: imageUrl,
            },
        });

        return NextResponse.json(
            {
                message: "Techstack berhasil ditambahkan",
                status: "Sukses",
                project: newTechStack,
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: `Error creating Techstack: ${error}` },
            { status: 500 }
        );
    }
}