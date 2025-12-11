"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Book, BookChapter, BookUserProgress, BookPurchase } from "@/generated/prisma/client";
import { BookSidebar } from "./book-sidebar";

interface BookMobileSidebarProps {
    course: Book & {
        chapters: (BookChapter & {
            userProgress: BookUserProgress[] | null;
        })[];
    };
    progressCount: number;
    purchase: BookPurchase | null; // ✅ Add this
}

export const BookMobileSidebar = ({ course, progressCount, purchase }: BookMobileSidebarProps) => {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white w-72">
                <BookSidebar
                    course={course}
                    progressCount={progressCount}
                    purchase={purchase} // ✅ Pass down
                />
            </SheetContent>
        </Sheet>
    )
}