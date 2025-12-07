import Mux from "@mux/mux-node";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
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

        if (chapter.videourl) {
            const existingMuxData = await prisma.muxData.findUnique({
                where: {
                    chapterId: chapterId  // ✅ Use chapterId
                }
            })

            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
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
            await prisma.course.update({
                where: {
                    id: courseId  // ✅ Use courseId
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
    { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { courseId, chapterId } = await params;  // ✅ Await params
        //@ts-ignore
        const { isPublished, ...values } = await req.json();

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

        const chapter = await prisma.chapter.update({
            where: {
                id: chapterId,  // ✅ Use chapterId
                courseId: courseId,  // ✅ Use courseId
            },
            data: {
                ...values,
            },
        });

        if (values.videourl) {
            console.log("[MUX_UPLOAD] values.videourl =", values.videourl);
            // Delete previous asset and DB record if exists
            const existingMuxData = await prisma.muxData.findFirst({
                where: { chapterId: chapterId },  // ✅ Use chapterId
            });

            if (existingMuxData) {
                console.log("[MUX_UPLOAD] Deleting existing Mux asset:", existingMuxData.assetId);
                await mux.video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({ where: { id: existingMuxData.id } });
            }
            //@ts-ignore
            const asset = await mux.video.assets.create({
                input: values.videourl,
                playback_policy: ["public"],
            });
            console.log("[MUX_UPLOAD] Mux asset created:", asset.id);
            await prisma.muxData.create({
                data: {
                    chapterId: chapterId,  // ✅ Use chapterId
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                },
            });
            console.log("[MUX_UPLOAD] Mux data saved to DB.");
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[COURSE_CHAPTER_ID] Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}