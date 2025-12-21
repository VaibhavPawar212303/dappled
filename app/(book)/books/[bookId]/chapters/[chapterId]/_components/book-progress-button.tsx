"use client";

import axios from "axios";
import { CheckCircle, XCircle, Lock } from "lucide-react"; // Added Lock icon
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/components/hooks/use-confetti-store";
import { useQuizStore } from "@/components/hooks/use-quiz-store";

interface BookProgressButtonProps {
  chapterId: string;
  bookId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
  hasQuiz?: boolean; // ✅ New Prop
}

export const BookProgressButton = ({
  chapterId,
  bookId,
  isCompleted,
  nextChapterId,
  hasQuiz = false // Default to false
}: BookProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const { isQuizCompleted } = useQuizStore(); // ✅ Check Store
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/books/${bookId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/books/${bookId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ LOGIC: Disable if (Not Completed AND Has Quiz AND Quiz Not Done)
  // We allow un-completing even if quiz isn't "freshly" done
  const isLockedByQuiz = !isCompleted && hasQuiz && !isQuizCompleted;

  const Icon = isLockedByQuiz ? Lock : (isCompleted ? XCircle : CheckCircle);

  return (
    <Button
      onClick={onClick}
      // Disable if loading OR if locked by quiz
      disabled={isLoading || isLockedByQuiz} 
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {isLockedByQuiz 
        ? "Finish Quiz to Continue" 
        : isCompleted ? "Not completed" : "Mark as Read"
      }
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  )
}