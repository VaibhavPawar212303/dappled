"use client"

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react"

interface ChapterVideoProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId: string
}
//@ts-ignore
const formSchema = z.object({
    videourl: z.string().min(1),
});

export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current)

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter Updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videourl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an video
                        </>
                    )}
                    {!isEditing && initialData.videourl && (
                        <><Pencil className="h-4 w-4 mr-2 cursor-pointer" />Edit video</>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.videourl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video
                            className="h-10 w-10 text-slate-500"
                        />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer
                            playbackId={initialData?.muxData?.playbackId || ""}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ videourl: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted foreground mt-4">
                        Upload this chapter video
                    </div>
                </div>
            )}
            {
                initialData.videourl && !isEditing && (
                    <div className="text-sm text-muted-foreground mt-2">
                        video can take  a few minute to process. Refresh the page if video does not appear
                    </div>
                )
            }
        </div>
    )
}

