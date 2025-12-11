"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { TiptapEditor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { BookChapter } from "@/generated/prisma/client"; // Import BookChapter, not Book

interface BookChapterContentFormProps {
    initialData: BookChapter;
    bookId: string;
    chapterId: string;
}

const formSchema = z.object({
    content: z.string().min(1),
});

export const BookChapterContentForm = ({ initialData, bookId, chapterId }: BookChapterContentFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: initialData?.content || ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Update to the Books API endpoint
            await axios.patch(`/api/books/${bookId}/chapters/${chapterId}`, values);
            toast.success("Chapter content updated");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter Content
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <><Pencil className="h-4 w-4 mr-2 cursor-pointer" />Edit content</>
                    )}
                </Button>
            </div>
            {
                !isEditing && (
                    <div className={cn(
                        "text-sm mt-2", !initialData.content && "text-slate-500 italic"
                    )}>
                        {!initialData.content && "No content written yet."}
                        {initialData.content && (
                            <Preview
                                value={initialData.content}
                            />
                        )}
                    </div>
                )
            } {
                isEditing && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                            <FormField
                                control={form.control}
                                name="content" // Use 'content' to match Schema
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <TiptapEditor
                                                content={field.value || ""}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center gap-x-2">
                                <Button
                                    disabled={!isValid || isSubmitting}
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            }
        </div>
    )
}