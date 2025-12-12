"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Sparkles, ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form, FormControl, FormField, FormItem, FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TiptapEditor } from "@/components/richeditor"; // Ensure this matches your editor path
import { Preview } from "@/components/preview";
import { Blog } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";

interface BlogContentFormProps {
    initialData: Blog;
    blogId: string;
}

const formSchema = z.object({
    content: z.string().min(1),
    draftContent: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const BlogContentForm = ({ initialData, blogId }: BlogContentFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(false);
    const [loadingText, setLoadingText] = useState("AI is working...");

    const toggleEdit = () => setIsEditing((current) => !current);
    const toggleAiPanel = () => setShowAiPanel((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: initialData?.content || "",
            draftContent: initialData?.draftContent || "",
            tags: initialData?.tags || [],
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/blogs/${blogId}`, values);
            toast.success("Blog updated");
            setIsEditing(false);
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const onGenerateFromTitle = async () => {
        try {
            setIsAiLoading(true);
            setShowAiPanel(true);
            setLoadingText("🔍 Searching live market data...");

            const response = await axios.post("/api/ai/generate", {
                type: "generate_from_title",
                prompt: initialData.title,
            });

            setLoadingText("✍️ Drafting content...");
            form.setValue("draftContent", response.data.output);
            toast.success("Blog generated with real-time data");
        } catch {
            toast.error("AI Generation Failed");
        } finally {
            setIsAiLoading(false);
            setLoadingText("AI is working...");
        }
    };

    const onGenerateTags = async () => {
        try {
            setIsAiLoading(true);
            setLoadingText("Analyzing trends...");

            const response = await axios.post("/api/ai/generate", {
                type: "generate_tags",
                prompt: initialData.title,
                currentContent: form.getValues("content")
            });

            const tags = JSON.parse(response.data.output);
            form.setValue("tags", tags);
            toast.success("Tags Generated");
        } catch {
            toast.error("Failed to generate tags");
        } finally {
            setIsAiLoading(false);
            setLoadingText("AI is working...");
        }
    };

    const copyDraftToMain = () => {
        const draft = form.getValues("draftContent");
        if (draft) {
            form.setValue("content", draft);
            toast.success("Draft copied to Main Editor");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between mb-4">
                <div className="flex items-center gap-x-2">
                    <span>Blog Content</span>
                    {!isEditing && initialData.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                </div>
                {!isEditing && (
                    <Button onClick={toggleEdit} variant="ghost">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </div>

            {!isEditing && (
                <div className={cn("text-sm mt-2 max-h-[400px] overflow-y-auto", !initialData.content && "text-slate-500 italic")}>
                    {!initialData.content && "No content written yet."}
                    {initialData.content && <Preview value={initialData.content} />}
                </div>
            )}

            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* AI TOOLBAR */}
                        <div className="flex flex-wrap items-center gap-2 mb-2 p-2 bg-white rounded-md border shadow-sm">
                            <Button type="button" variant="outline" size="sm" onClick={onGenerateFromTitle} disabled={isAiLoading}>
                                <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                                {isAiLoading ? loadingText : "Auto-Write with Market Data"}
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={onGenerateTags} disabled={isAiLoading}>
                                <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
                                Generate Tags
                            </Button>
                            <Button type="button" variant={showAiPanel ? "secondary" : "ghost"} size="sm" onClick={toggleAiPanel} className="ml-auto">
                                {showAiPanel ? "Close Draft" : "Open AI Draft"}
                            </Button>
                        </div>

                        {/* SPLIT EDITOR */}
                        <div className="flex flex-col md:flex-row gap-4 h-full">
                            {/* LEFT: MAIN CONTENT */}
                            <div className="flex-1 space-y-2">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Public Content</p>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <TiptapEditor
                                                    //@ts-ignore
                                                    content={field.value} onChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* RIGHT: AI DRAFT */}
                            {showAiPanel && (
                                <div className="flex-1 space-y-2 border-l pl-4 border-slate-300">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">AI Sandbox / Draft</p>
                                        <Button type="button" size="sm" variant="ghost" onClick={copyDraftToMain} title="Copy Draft to Main">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Use Draft
                                        </Button>
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="draftContent"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <TiptapEditor content={field.value || ""} onChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        {/* FOOTER ACTIONS */}
                        <div className="flex items-center justify-between gap-x-2 mt-4 pt-4 border-t">
                            <div className="flex gap-2 flex-wrap">
                                {form.watch("tags")?.map((tag, i) => (
                                    <Badge key={i} className="bg-blue-100 text-blue-700">{tag}</Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={toggleEdit} type="button" variant="ghost">Cancel</Button>
                                <Button disabled={!isValid || isSubmitting} type="submit">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};