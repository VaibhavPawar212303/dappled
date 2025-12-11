import Mux from "@mux/mux-node";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function DELETE(
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


        const deletedChapter = await prisma.chapter.delete({
            where: {
                id: chapterId  // ✅ Use chapterId
            }
        });

        const isPublishedChapterInCourse = await prisma.chapter.findMany({
            where: {
                id: chapterId,  // ✅ Use chapterId
                isPublished: true
            }
        });

        if (!isPublishedChapterInCourse.length) {
            await prisma.book.update({
                where: {
                    id: bookId  // ✅ Use courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.error("[COURSE_CHAPTER_ID] Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ bookId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { bookId, chapterId } = await params;  // ✅ Await params
        //@ts-ignore
        const { isPublished, ...values } = await req.json();

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

        const chapter = await prisma.bookChapter.update({
            where: {
                id: chapterId,  // ✅ Use chapterId
                bookId: bookId,  // ✅ Use courseId
            },
            data: {
                ...values,
            },
        });
        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[COURSE_CHAPTER_ID] Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}