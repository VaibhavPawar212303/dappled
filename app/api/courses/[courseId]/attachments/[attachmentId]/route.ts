import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { courseId: string, attachmentId: string } }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const CourseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!CourseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        };

        const attachement = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentId
            }
        });

        return NextResponse.json(attachement);

    } catch (error) {
        console.log("ATTACHEMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}