"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export const ShareButton = () => {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        // Copies the current browser URL
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link copied to clipboard!");

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    return (
        <Button onClick={onCopy} size="sm" variant="ghost">
            {copied ? (
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
            ) : (
                <Share2 className="h-4 w-4 mr-2" />
            )}
            Share
        </Button>
    )
}