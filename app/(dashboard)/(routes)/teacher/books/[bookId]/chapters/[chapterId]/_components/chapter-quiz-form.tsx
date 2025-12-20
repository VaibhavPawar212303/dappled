"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BrainCircuit, Loader2, PlusCircle, Sparkles, CheckCircle, Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Make sure you have this utility
import { BookChapter } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ChapterQuizFormProps {
  initialData: BookChapter;
  bookId: string;
  chapterId: string;
}

// Define the shape of a single question
type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

const formSchema = z.object({
  quizData: z.string().optional(), 
});

export const ChapterQuizForm = ({
  initialData,
  bookId,
  chapterId,
}: ChapterQuizFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  // Convert DB JSON object to string for the Textarea (Edit Mode)
  const initialQuizString = initialData.quiz 
    ? JSON.stringify(initialData.quiz, null, 2) 
    : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizData: initialQuizString,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/books/${bookId}/chapters/${chapterId}`, values);
      toast.success("Quiz saved");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onGenerateQuiz = async () => {
    try {
      setIsGenerating(true);
      const response = await axios.post("/api/ai/generate", {
        type: "generate_quiz",
        prompt: initialData.title,
        currentContent: initialData.content 
      });

      const formattedJson = JSON.stringify(JSON.parse(response.data.output), null, 2);
      
      form.setValue("quizData", formattedJson);
      toast.success("AI Quiz Generated");
    } catch (error) {
      toast.error("Failed to generate quiz");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Safe cast the quiz data for View Mode
  const quizQuestions = (Array.isArray(initialData.quiz) ? initialData.quiz : []) as Question[];

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            Chapter Quiz (AI)
            <BrainCircuit className="h-4 w-4 text-purple-600" />
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit / Generate
            </>
          )}
        </Button>
      </div>
      
      {/* ✅ VIEW MODE: Render Questions Nicely */}
      {!isEditing && (
        <div className="space-y-4">
           {quizQuestions.length > 0 ? (
             <div className="flex flex-col gap-4">
               {quizQuestions.map((q, index) => (
                 <div key={index} className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-semibold text-sm text-slate-800">
                            {index + 1}. {q.question}
                        </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                        {q.options.map((option, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "text-xs p-2 rounded border",
                                    // Highlight the correct answer in Green
                                    i === q.correctAnswer 
                                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-medium" 
                                        : "bg-slate-50 border-slate-100 text-slate-600"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {i === q.correctAnswer && <CheckCircle className="h-3 w-3 text-emerald-600" />}
                                    {option}
                                </div>
                            </div>
                        ))}
                    </div>

                    {q.explanation && (
                        <div className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">
                            <span className="font-semibold text-slate-600">Explanation: </span>
                            {q.explanation}
                        </div>
                    )}
                 </div>
               ))}
             </div>
           ) : (
             <div className="text-slate-500 italic text-sm">
               No quiz configured. Click edit to generate one with AI.
             </div>
           )}
        </div>
      )}

      {/* ✅ EDIT MODE: Show JSON Editor & AI Button */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="flex items-center gap-2 mb-2">
                <Button 
                    type="button" 
                    onClick={onGenerateQuiz} 
                    disabled={isGenerating || !initialData.content}
                    variant="outline"
                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {isGenerating ? "Generating..." : "Generate Quiz from Content"}
                </Button>
            </div>

            <FormField
              control={form.control}
              name="quizData"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder='[ { "question": "...", "options": [...] } ]'
                      className="min-h-[300px] font-mono text-xs bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save Quiz
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};