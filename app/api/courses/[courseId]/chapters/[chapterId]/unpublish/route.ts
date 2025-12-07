import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;  // ✅ Await params

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const ownCourse = await prisma.course.findUnique({
            where: {
                id: courseId,  // ✅ Use courseId
                userId,
            },
        });
        
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const unpublishedChapterInCourse = await prisma.chapter.update({
            where: {
                id: chapterId,  // ✅ Use chapterId
                courseId: courseId  // ✅ Use courseId
            },
            data: {
                isPublished: false
            }
        })
        
        const publishedChapterInCourse = await prisma.chapter.findMany({
            where: {
                courseId: courseId,  // ✅ Use courseId
                isPublished: true
            }
        })
        
        if (!publishedChapterInCourse.length) {
            await prisma.course.update({
                where: {
                    id: courseId  // ✅ Use courseId
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