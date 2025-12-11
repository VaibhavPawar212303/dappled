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
        
        const unpublishedChapterInCourse = await prisma.bookChapter.update({
            where: {
                id: chapterId,  // ✅ Use chapterId
                bookId: bookId  // ✅ Use courseId
            },
            data: {
                isPublished: false
            }
        })
        
        const publishedChapterInCourse = await prisma.bookChapter.findMany({
            where: {
                bookId: bookId,  // ✅ Use courseId
                isPublished: true
            }
        })
        
        if (!publishedChapterInCourse.length) {
            await prisma.book.update({
                where: {
                    id: bookId  // ✅ Use courseId
                },
                data: {
                    isPublished: false
                }
            })
        }
        
        return NextResponse.json(unpublishedChapterInCourse);
    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse("Internale Error", { status: 500 })
    }
}