import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request, 
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId } = await params;  // ✅ Await params
        
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        
        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,  // ✅ Use courseId
                userId
            },
        })
        
        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { url } = body;

        const attachement = await prisma.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: courseId  // ✅ Use courseId
            }
        });

        return NextResponse.json(attachement)

    } catch (error) {
        console.log("COURSE_ID_ATTACHEMENTS", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}