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

    const unpublishedBlog = await prisma.blog.update({
      where: { id: blogId, userId },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedBlog);
  } catch (error) {
    console.log("[BLOG_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}