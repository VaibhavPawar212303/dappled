"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Sparkles, ArrowLeft, Save, Maximize, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
    Form, FormControl, FormField, FormItem, FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// Ensure this path matches where you saved your updated editor component
import { TiptapEditor } from "@/components/expand-editor";
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
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [loadingText, setLoadingText] = useState("AI is working...");

    const toggleEdit = () => setIsEditing((current) => !current);

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
            setIsFullScreen(false);
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const onGenerateFromTitle = async () => {
        try {
            setIsAiLoading(true);
            setIsFullScreen(true);

            // Stage 1: Research
            setLoadingText("🕵️‍♂️ Agents are browsing the web...");

            const response = await axios.post("/api/ai/generate", {
                type: "generate_from_title",
                prompt: initialData.title,
            });

            // Stage 2: Drafting
            setLoadingText("🧠 Synthesizing insights...");

            form.setValue("draftContent", response.data.output);
            toast.success("Comprehensive Draft Generated");
        } catch (error) {
            console.error(error);
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
        } else {
            toast.error("Draft is empty");
        }
    };

    const ActionToolbar = () => (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onGenerateFromTitle}
                disabled={isAiLoading}
                className="bg-white border-purple-200 text-purple-700 hover:bg-purple-50"
            >
                <Sparkles className="h-4 w-4 mr-2" />
                {isAiLoading ? loadingText : "Auto-Write Draft"}
            </Button>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onGenerateTags}
                disabled={isAiLoading}
                className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
            >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Tags
            </Button>
        </div>
    );

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

                        {/* ---------------------------------------------------------- */}
                        {/* 1. FULL SCREEN OVERLAY (Split View)                        */}
                        {/* ---------------------------------------------------------- */}
                        {isFullScreen && (
                            <div className="fixed inset-0 z-[9999] bg-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">

                                {/* Top Bar */}
                                <div className="h-16 border-b bg-white px-4 flex items-center justify-between shadow-sm flex-shrink-0 z-50">
                                    <div className="flex items-center gap-4">
                                        <h2 className="font-bold text-lg hidden md:block">AI Writer Studio</h2>
                                        <div className="h-6 w-[1px] bg-slate-300 hidden md:block" />
                                        <ActionToolbar />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            // Trigger submit manually since we are visually outside the form, 
                                            // but structurally inside the Form Context
                                            onClick={form.handleSubmit(onSubmit)}
                                            disabled={!isValid || isSubmitting}
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save & Close
                                        </Button>
                                        <Button onClick={() => setIsFullScreen(false)} variant="ghost" size="sm">
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Split Editor Area */}
                                <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-200/50">

                                    {/* LEFT: Public Content */}
                                    <div className="flex-1 flex flex-col border-r border-slate-300 bg-white h-full overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
                                        <div className="p-4 bg-white border-b text-xs font-bold text-slate-600 uppercase tracking-wider sticky top-0 z-20 shadow-sm">
                                            Public Content (Live)
                                        </div>
                                        {/* Added pb-32 to give space at the bottom */}
                                        <div className="flex-1 overflow-y-auto pb-32">
                                            <FormField
                                                control={form.control}
                                                name="content"
                                                render={({ field }) => (
                                                    <FormItem className="h-full">
                                                        <FormControl>
                                                            <TiptapEditor
                                                                //@ts-ignore
                                                                content={field.value}
                                                                onChange={field.onChange}
                                                                className="h-full border-0 rounded-none min-h-screen px-8 py-6"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* RIGHT: AI Sandbox */}
                                    <div className="flex-1 flex flex-col bg-[#fafafa] h-full overflow-hidden">
                                        <div className="p-3 bg-purple-50/50 border-b text-xs font-bold text-purple-700 uppercase tracking-wider flex justify-between items-center sticky top-0 z-20 backdrop-blur-sm">
                                            <span className="flex items-center gap-2">
                                                <Sparkles className="h-3 w-3" />
                                                AI Sandbox (Draft)
                                            </span>
                                            <Button type="button" size="sm" variant="ghost" onClick={copyDraftToMain} className="h-6 text-xs hover:bg-purple-100 text-purple-700">
                                                <ArrowLeft className="h-3 w-3 mr-1" />
                                                Copy to Public
                                            </Button>
                                        </div>
                                        {/* Added pb-32 here as well */}
                                        <div className="flex-1 overflow-y-auto pb-32">
                                            <FormField
                                                control={form.control}
                                                name="draftContent"
                                                render={({ field }) => (
                                                    <FormItem className="h-full">
                                                        <FormControl>
                                                            <TiptapEditor
                                                                content={field.value || ""}
                                                                onChange={field.onChange}
                                                                className="h-full border-0 rounded-none bg-transparent min-h-screen px-8 py-6"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. NORMAL INLINE MODE */}
                        <div className="flex flex-wrap items-center gap-2 mb-2 p-2 bg-white rounded-md border shadow-sm justify-between">
                            <ActionToolbar />
                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={() => setIsFullScreen(true)}
                                className="bg-slate-800 text-white hover:bg-slate-900"
                            >
                                <Maximize className="h-4 w-4 mr-2" />
                                Open Studio
                            </Button>
                        </div>

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <TiptapEditor
                                            //@ts-ignore
                                            content={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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