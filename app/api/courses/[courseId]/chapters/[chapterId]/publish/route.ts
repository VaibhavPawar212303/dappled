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
        
        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,  // ✅ Use chapterId
                courseId: courseId,  // ✅ Use courseId
            }
        });
        
        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }
        
        const muxData = await prisma.muxData.findUnique({
            where: {
                chapterId: chapterId  // ✅ Use chapterId
            }
        })
        
        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videourl) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        
        const publishedChapter = await prisma.chapter.update({
            where: {
                id: chapterId,  // ✅ Use chapterId
                courseId: courseId  // ✅ Use courseId
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