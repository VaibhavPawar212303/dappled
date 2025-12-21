import { create } from "zustand";

interface QuizStore {
  isQuizCompleted: boolean;
  setIsQuizCompleted: (completed: boolean) => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  isQuizCompleted: false,
  setIsQuizCompleted: (completed) => set({ isQuizCompleted: completed }),
}));