"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, HelpCircle, RefreshCw, Trophy } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";     // Ensure path is correct
import { useConfettiStore } from "@/components/hooks/use-confetti-store";
import { useQuizStore } from "@/components/hooks/use-quiz-store";

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
};

interface StudentQuizProps {
  quizData: any; // Raw JSON from DB
}

export const StudentQuiz = ({ quizData }: StudentQuizProps) => {
  const confetti = useConfettiStore();
  const { setIsQuizCompleted } = useQuizStore();

  // Safe cast quiz data
  const questions = (Array.isArray(quizData) ? quizData : []) as Question[];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  // 1. Reset global store state when component mounts or data changes
  useEffect(() => {
    setIsQuizCompleted(false);
  }, [setIsQuizCompleted, quizData]);

  // If no quiz exists, don't render anything
  if (!questions || questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const checkAnswer = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      confetti.onOpen(); 
    }
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowScore(true);
      setIsQuizCompleted(true); // ✅ Unlock the 'Mark as Read' button
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowScore(false);
    setIsQuizCompleted(false); // Re-lock until finished again
  };

  if (showScore) {
    return (
      <Card className="mt-8 border-2 border-slate-200">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
          <h3 className="text-2xl font-bold text-slate-800">Quiz Completed!</h3>
          <p className="text-lg text-slate-600 mt-2">
            You scored <span className="font-bold text-purple-600">{score}</span> out of <span className="font-bold">{questions.length}</span>
          </p>
          <Button onClick={resetQuiz} className="mt-6" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8">
      <Card className="border-2 border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              Knowledge Check
            </CardTitle>
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} / {questions.length}
            </Badge>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium text-slate-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = index === currentQuestion.correctAnswer;
              
              // Dynamic Styling Logic
              let style = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
              
              if (isAnswered) {
                if (isCorrect) {
                  style = "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium";
                } else if (isSelected && !isCorrect) {
                  style = "border-red-500 bg-red-50 text-red-700";
                } else {
                  style = "opacity-50"; // Dim other options
                }
              } else if (isSelected) {
                style = "border-purple-600 bg-purple-50 ring-1 ring-purple-600 text-purple-700";
              }

              return (
                <div
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={cn(
                    "relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                    style,
                    isAnswered && "cursor-default"
                  )}
                >
                  <div className="flex-1 text-sm">{option}</div>
                  {isAnswered && isCorrect && <CheckCircle className="h-5 w-5 text-emerald-600 ml-2" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600 ml-2" />}
                </div>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && currentQuestion.explanation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 animate-in fade-in slide-in-from-top-2">
              <span className="font-bold">Explanation:</span> {currentQuestion.explanation}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 pb-6 flex justify-end">
          {!isAnswered ? (
            <Button 
              onClick={checkAnswer} 
              disabled={selectedOption === null}
              className="w-full md:w-auto"
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={nextQuestion} className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">
              {currentQuestionIndex + 1 === questions.length ? "View Results" : "Next Question"}
              <RefreshCw className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};