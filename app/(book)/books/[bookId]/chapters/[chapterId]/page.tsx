import { getBookChapter } from "@/actions/get-book-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { formatPrice } from "@/lib/format";

const BookChapterIdPage = async ({ 
    params 
}: { 
    params: Promise<{ bookId: string; chapterId: string }> 
}) => {
    const { userId } = await auth();
    const { bookId, chapterId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const {
        chapter,
        book,
        purchase,
        nextChapter,
        userProgress,
        isLocked
    } = await getBookChapter({
        userId,
        bookId,
        chapterId
    });

    if (!chapter || !book) {
        return redirect("/");
    }

    return (
        <div>
            {/* 1. Completion Banner */}
            {userProgress?.isCompleted && (
                <Banner variant="suceess" label="You have read this chapter." />
            )}

            {/* 2. Locked Banner */}
            {isLocked && (
                <Banner
                    variant="warning"
                    label="You need to purchase this book to read this chapter."
                />
            )}

            <div className="flex flex-col max-w-4xl mx-auto pb-20 px-4 mt-6">
                
                {/* 3. Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between pb-4">
                    <h2 className="text-3xl font-bold">
                        {chapter.title}
                    </h2>

                    {/* Action Buttons */}
                    <div className="mt-4 md:mt-0">
                        {purchase ? (
                            /* Replace with <BookProgressButton /> later */
                            <Button variant="success" size="sm">
                                Mark as Read
                            </Button>
                        ) : (
                             /* Replace with <BookEnrollButton /> later */
                            <Button size="sm" className="w-full md:w-auto">
                                Buy for {formatPrice(book.price || 0)}
                            </Button>
                        )}
                    </div>
                </div>

                <Separator />

                {/* 4. Content Section */}
                <div className="mt-6">
                    {isLocked ? (
                        <div className="flex flex-col items-center justify-center h-60 bg-slate-100 rounded-md gap-y-2 text-slate-500">
                            <Lock className="h-8 w-8" />
                            <p>This chapter is locked.</p>
                        </div>
                    ) : (
                        // Render the actual book text here
                        <div className="prose max-w-none p-4 bg-white rounded-md border shadow-sm">
                            <Preview value={chapter.content} />
                        </div>
                    )}
                </div>

                {/* 5. Navigation Footer */}
                <div className="flex items-center justify-between mt-8">
                    {/* You can add a Previous button logic here if desired */}
                    <div /> 
                    
                    {nextChapter && (
                        <Link
                            href={`/books/${bookId}/chapters/${nextChapter.id}`}
                            className="flex items-center"
                        >
                            <Button variant="ghost">
                                Next Chapter
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookChapterIdPage;