import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
    req: Request, 
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;  // ✅ Await params
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const course = await db.course.findUnique({
            where: {
                id: courseId,  // ✅ Use courseId
                userId,
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
            return new NextResponse("Not Found", { status: 404 });
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await mux.video.assets.delete(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: courseId  // ✅ Use courseId
            }
        })

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.error("[COURSE_CHAPTER_ID] Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;  // ✅ Await params
        const values = await req.json();
        
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        const course = await db.course.update({
            where: {
                id: courseId,  // ✅ Use courseId
                userId
            },
            data: {
                ...values
            }
        })
        
        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}