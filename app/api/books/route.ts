import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Assuming your prisma client is here
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const book = await prisma.book.create({
      data: {
        userId,
        title,
      }
    });

    return NextResponse.json(book);
  } catch (error) {
    console.log("[BOOKS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}