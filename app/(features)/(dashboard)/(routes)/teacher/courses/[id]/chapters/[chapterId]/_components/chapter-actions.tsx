"use client"
import axios from "axios"
import toast from "react-hot-toast"
import { ConfirmModel } from "@/components/models/confirm-model"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"


interface ChapterActionsProps {
    disabled: boolean,
    courseId: string,
    chapterId: string,
    isPublished: boolean
}

export const ChapterActions = ({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("chapter unpublished");
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("chapter published");
            }
            router.refresh();
        } catch {

        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModel onConfirm={onDelete}>
                <Button size="sm">
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModel>
        </div>
    )
}