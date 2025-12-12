import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.create({
      data: {
        userId,
        title,
        content: "", 
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.log("[BLOG_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}