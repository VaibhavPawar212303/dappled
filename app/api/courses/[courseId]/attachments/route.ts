import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
        })
        if (!courseOwner) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { url } = body;

        const attachement = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: params.courseId
            }
        });

        return NextResponse.json(attachement)

    } catch (error) {
        console.log("COURSE_ID_ATTACHEMENTS", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

