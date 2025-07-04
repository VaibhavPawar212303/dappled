import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});


export async function DELETE(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            }
        });
        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }
        if (chapter.videourl) {
            const existingMuxData = await db.muxData.findUnique({
                where: {
                    chapterId: params.chapterId
                }
            })

            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
        }
        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        });
        const isPublishedChapterInCourse = await db.chapter.findMany({
            where: {
                id: params.chapterId,
                isPublished: true
            }
        });
        if (!isPublishedChapterInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
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
    req: Request, { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = await auth();
        //@ts-ignore
        const { isPublished, ...values } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            },
        });
        if (values.videourl) {
            console.log("[MUX_UPLOAD] values.videourl =", values.videourl);
            // Delete previous asset and DB record if exists
            const existingMuxData = await db.muxData.findFirst({
                where: { chapterId: params.chapterId },
            });

            if (existingMuxData) {
                console.log("[MUX_UPLOAD] Deleting existing Mux asset:", existingMuxData.assetId);
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({ where: { id: existingMuxData.id } });
            }
            //@ts-expect-error
            const asset = await mux.video.assets.create({
                input: values.videourl,
                playback_policy: ["public"],
            });
            console.log("[MUX_UPLOAD] Mux asset created:", asset.id);
            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
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
