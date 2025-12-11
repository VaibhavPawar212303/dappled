import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: { params: Promise<{ bookId: string }> }) {
  try {
    const { userId } = await auth();
    const { bookId } = await context.params; 

    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await prisma.book.update({
      where: {
        id: bookId,
        userId,
      },
      data: values,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[BOOK_ID]", error);
    return new NextResponse("Internal Error");
  }
}
