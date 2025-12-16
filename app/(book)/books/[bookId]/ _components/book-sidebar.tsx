import { Book, BookChapter, BookUserProgress, BookPurchase } from "@prisma/client";
import { CourseProgress } from "@/components/course-progress";
import { BookSidebarItem } from "./book-sidebar-item";

interface BookSidebarProps {
    course: Book & {
        chapters: (BookChapter & {
            userProgress: BookUserProgress[] | null
        })[]
    };
    progressCount: number;
    purchase: BookPurchase | null; // ✅ Receive via prop
}

export const BookSidebar = ({ course, progressCount, purchase }: BookSidebarProps) => {
    // ✅ No prisma queries here!

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-white">
            <div className="p-8 flex flex-col border-b">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                {purchase && (
                    <div className="mt-10">
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                    <BookSidebarItem
                        key={chapter.id}
                        id={chapter.id}
                        label={chapter.title}
                        isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                        bookId={course.id}
                        isLocked={!chapter.isFree && !purchase}
                    />
                ))}
            </div>
        </div>
    )
}