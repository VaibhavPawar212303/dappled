import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request, 
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;  // ✅ Await params
        const { isCompleted } = await req.json();
        
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        const userProgress = await prisma.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: chapterId,  // ✅ Use chapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId: chapterId,  // ✅ Use chapterId
                isCompleted,
            }
        });
        
        return NextResponse.json(userProgress);
    } catch (error) {
        console.log("[CHAPTER_ID_PROGRESS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}