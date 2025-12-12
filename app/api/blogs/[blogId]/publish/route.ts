import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { userId } = await auth();
    const { blogId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId, userId },
    });

    if (!blog) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Validation: Ensure required fields exist before publishing
    if (!blog.title || !blog.content || !blog.imageUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedBlog = await prisma.blog.update({
      where: { id: blogId, userId },
      data: { isPublished: true },
    });

    return NextResponse.json(publishedBlog);
  } catch (error) {
    console.log("[BLOG_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}