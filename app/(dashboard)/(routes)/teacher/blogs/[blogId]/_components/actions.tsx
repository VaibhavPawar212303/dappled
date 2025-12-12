"use client"

import axios from "axios"
import { Trash } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ConfirmModel } from "@/components/models/confirm-model" 

interface ActionsProps {
    disabled: boolean;
    blogId: string;
    isPublished: boolean;
}

export const Actions = ({
    disabled,
    blogId,
    isPublished
}: ActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/blogs/${blogId}/unpublish`);
                toast.success("Blog unpublished");
            } else {
                await axios.patch(`/api/blogs/${blogId}/publish`);
                toast.success("Blog published");
            }

            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);
            
            await axios.delete(`/api/blogs/${blogId}`);
            
            toast.success("Blog deleted");
            router.refresh();
            
            // Redirect to the list of blogs
            router.push(`/teacher/blogs`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            
            <ConfirmModel onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading} variant="destructive">
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModel>
        </div>
    )
}