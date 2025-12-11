import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request, 
    { params }: { params: Promise<{ bookId: string }> }
) {
    try {
        const { userId } = await auth();
        const { bookId } = await params;  // ✅ Await params
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const courseOwner = await prisma.book.findUnique({
            where: {
                id: bookId,  // ✅ Use courseId
                userId: userId
            }
        });

        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const lastChapter = await prisma.bookChapter.findFirst({
            where: {
                bookId: bookId,  // ✅ Use courseId
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;
        const chapter = await prisma.bookChapter.create({
            data: {
                title,
                bookId: bookId,  // ✅ Use courseId
                position: newPosition,
                content:''
            }
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[CHAPTERS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}