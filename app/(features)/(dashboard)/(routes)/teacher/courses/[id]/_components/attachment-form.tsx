"use client"

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { PlusCircle, File, Loader2, X } from "lucide-react";
import { useState } from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

// Define Attachment type if not imported from elsewhere
type Attachment = {
    id: string;
    url: string;
    name?: string;
    // Add other fields as needed
};

interface AttachmentFormProps {
    initialData: Course & { attachmets: Attachment[] };
    courseId: string;
}
//@ts-ignore
const formSchema = z.object({
    url: z.string().min(1),
});

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current)

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course Updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachement deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        } finally {
            setDeletingId(null)
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachmets.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>
                    )}{
                        initialData.attachmets.length > 0 && (
                            <div className="space-y-2">
                                {initialData.attachmets.map((attachment) => (
                                    <div key={attachment.id}
                                        className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                    >
                                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                        <p className="text-xs line-clamp-1">{attachment.name}</p>
                                        {deletingId === attachment.id && (
                                            <div>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            </div>
                                        )}
                                        {deletingId !== attachment.id && (
                                            <button className="ml-auto hover:opacity-75 transition" onClick={() => onDelete(attachment.id)}>
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url })
                            }
                        }}
                    />
                    <div className="text-xs text-muted foreground mt-4">
                        Add anything your studensts might need to Complete the course.
                    </div>
                </div>
            )}
        </div>
    )
}

