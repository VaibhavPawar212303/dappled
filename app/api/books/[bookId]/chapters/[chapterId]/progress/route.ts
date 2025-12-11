import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request, 
    { params }: { params: Promise<{ bookId: string; chapterId: string }> } // ✅ Fixed type: bookId
) {
    try {
        const { userId } = await auth();
        const { bookId, chapterId } = await params; // ✅ Destructure bookId
        const { isCompleted } = await req.json();
        
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        // ✅ Use bookUserProgress table
        const userProgress = await prisma.bookUserProgress.upsert({
            where: {
                userId_bookChapterId: { // ✅ Use correct composite key for books
                    userId,
                    bookChapterId: chapterId,
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                bookChapterId: chapterId, // ✅ Map to bookChapterId field
                isCompleted,
            }
        });
        
        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[BOOK_CHAPTER_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}