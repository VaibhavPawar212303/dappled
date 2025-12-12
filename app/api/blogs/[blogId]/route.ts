import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// UPDATE (PATCH)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { userId } = await auth();
    const { blogId } = await params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.update({
      where: {
        id: blogId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.log("[BLOG_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    const { userId } = await auth();
    const { blogId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const blog = await prisma.blog.delete({
      where: {
        id: blogId,
        userId,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.log("[BLOG_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}