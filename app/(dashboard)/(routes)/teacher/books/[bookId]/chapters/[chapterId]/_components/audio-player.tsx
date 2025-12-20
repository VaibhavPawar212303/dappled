"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw, Volume2, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import axios from "axios";

interface AudioPlayerProps {
  text: string;
  initialVoice?: string | null;
  // ✅ Added these props to identify the chapter
  bookId: string;
  chapterId: string;
  isOwner?: boolean; // Optional: Only allow saving if user is the author
}

export const AudioPlayer = ({ text, initialVoice, bookId, chapterId,isOwner = false }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // 1. Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      let bestVoice: SpeechSynthesisVoice | undefined;

      // Try to find the voice saved in DB first
      if (initialVoice) {
        bestVoice = availableVoices.find(v => v.name === initialVoice);
      }

      // Fallback to "Natural" voices
      if (!bestVoice) {
        bestVoice = availableVoices.find(
            (v) => v.name.includes("Google US English") || v.name.includes("Natural")
        );
      }

      if (bestVoice) {
        setSelectedVoice(bestVoice);
      } else if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [initialVoice]);

  // 2. Prepare audio
  useEffect(() => {
    const cleanTextContent = (htmlContent: string) => {
      if (typeof window === "undefined") return "";
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      let rawText = tempDiv.textContent || tempDiv.innerText || "";
      return rawText.replace(/\s+/g, ' ').trim();
    };

    const cleanText = cleanTextContent(text);
    const u = new SpeechSynthesisUtterance(cleanText);

    if (selectedVoice) {
      u.voice = selectedVoice;
    }

    u.rate = 1;
    u.pitch = 1;

    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    setUtterance(u);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, selectedVoice]);

  const togglePlay = () => {
    if (!utterance) return;
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const onReset = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const changeVoice = async (voice: SpeechSynthesisVoice) => {
    window.speechSynthesis.cancel();
    setSelectedVoice(voice);
    setIsPlaying(false);
    setIsPaused(false);
    
    // Only save to DB if the user is the owner/author (since BookChapter is shared)
    // or if you want to allow anyone to change the global default (risky).
    
    try {
        // ✅ Correct API Endpoint
        await axios.patch(`/api/books/${bookId}/chapters/${chapterId}`, {
            preferredVoice: voice.name
        });
        toast.success(`Voice saved: ${voice.name}`);
    } catch {
        // If it fails (e.g. user is a student and 401s), we just show a local toast
        // allowing them to use the voice for this session only.
        console.log("Could not save preference to server");
        toast.success(`Voice changed locally to ${voice.name}`);
    }
  };

  return (
    <div className="flex items-center gap-x-2 bg-slate-100 p-2 rounded-full px-4 border shadow-sm">
        <Volume2 className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-medium text-slate-700 mr-2 hidden md:block w-24 truncate">
            {selectedVoice ? selectedVoice.name : "Loading..."}
        </span>
        
        <Button 
            onClick={togglePlay} 
            size="sm" 
            className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white p-0"
        >
            {isPlaying && !isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </Button>

        {isPlaying && (
            <Button onClick={onReset} size="sm" variant="ghost" className="h-8 w-8 rounded-full hover:bg-slate-200 p-0 text-slate-500">
                <RefreshCw className="h-4 w-4" />
            </Button>
        )}

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 hover:bg-slate-200">
                    <Settings2 className="h-4 w-4 text-slate-600" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto w-56">
                {voices.map((voice) => (
                    <DropdownMenuItem 
                        key={voice.name} 
                        onClick={() => changeVoice(voice)}
                        className="text-xs cursor-pointer"
                    >
                        <span className={selectedVoice?.name === voice.name ? "font-bold text-blue-700" : ""}>
                            {voice.name}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
};