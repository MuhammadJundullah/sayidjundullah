import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const { paths, tags } = await request.json();

  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.REVALIDATE_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (paths) {
      paths.forEach((path: string) => revalidatePath(path));
    }
    if (tags) {
      tags.forEach((tag: string) => revalidateTag(tag));
    }

    return NextResponse.json({
      success: true,
      revalidated: { paths, tags },
      now: Date.now(),
    });
  } catch {
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}
