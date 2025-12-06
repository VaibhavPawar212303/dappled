import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        });
        
        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }
        
        const hasPublishedChapter = course.chapters.some((chapter: typeof course.chapters[number]) => chapter.isPublished);  // ✅ Add explicit type
        
        if (!course.categoryId || !course.title || !course.description || !course.imageUrl || !hasPublishedChapter) {
            return new NextResponse("Missing required fields", { status: 400 });
        }
        
        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                isPublished: true
            }
        });
        
        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}