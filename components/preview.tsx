"use client";

import { useMemo } from "react";
// If you don't have this, you can just use the standard prose classes below
// relying on dynamic classes is fine here.
import { cn } from "@/lib/utils"; 

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  
  // Clean up content to prevent hydration mismatches if necessary
  const sanitizedContent = useMemo(() => {
    return value;
  }, [value]);

  return (
    <div 
      className={cn(
        "tiptap-content", // Custom class for global CSS targeting
        "prose prose-slate max-w-none", // Tailwind Typography
        // Custom overrides for specific elements:
        "prose-p:leading-7 prose-p:my-4", 
        "prose-headings:font-bold prose-headings:text-slate-900",
        "prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4",
        "prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-4",
        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
        "prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-4 prose-blockquote:italic",
        "prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4",
        "prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4",
        "prose-li:my-1",
        "prose-img:rounded-md prose-img:shadow-sm prose-img:my-6"
      )}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};