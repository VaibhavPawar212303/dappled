import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{ bookId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { bookId, chapterId } = await params;  // ✅ Await params

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const ownCourse = await prisma.book.findUnique({
            where: {
                id: bookId,  // ✅ Use courseId
                userId,
            },
        });
        
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const chapter = await prisma.bookChapter.findUnique({
            where: {
                id: chapterId,  // ✅ Use chapterId
                bookId: bookId,  // ✅ Use courseId
            }
        });
        
        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }
        
        if (!chapter  || !chapter.title || !chapter.content) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        
        const publishedChapter = await prisma.bookChapter.update({
            where: {
                id: chapterId,  // ✅ Use chapterId
                bookId: bookId  // ✅ Use courseId
            },
            data: {
                isPublished: true
            }
        })
        
        return NextResponse.json(publishedChapter);
    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse("Internale Error", { status: 500 })
    }
}