"use client"

import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
    chapterId: string;
    courseId: string;
    nextChapterId?: string;
    isCompleted?: boolean;
}

export const CourseProgressButton = ({ chapterId, courseId, isCompleted, nextChapterId }: CourseProgressButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const Icon = isCompleted ? XCircle : CheckCircle;

    const onClick = async () => {
        try {
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            });
            if (!isCompleted && nextChapterId) {
                router.push(`/course/${courseId}/chapters/${nextChapterId}`);
            }
            toast.success("Progress updated and chapter completed");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            type="button"
            variant={isCompleted ? "outline" : "success"
            }
            className="w-full md:w-auto"
        >
            {isCompleted ? "Not Completed" : "Mark as completed"}
            < Icon className="h-4 w-4 ml-2" />
        </Button >
    )
}