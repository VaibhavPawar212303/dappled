import { getBookChapter } from "@/actions/get-book-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { BookEnrollButton } from "./_components/book-enroll-button";
import { BookProgressButton } from "./_components/book-progress-button";
import { StudentQuiz } from "./_components/student-quiz";
import { AudioPlayer } from "@/app/(dashboard)/(routes)/teacher/books/[bookId]/chapters/[chapterId]/_components/audio-player";


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
        isLocked,
        userVoice
    } = await getBookChapter({
        userId,
        bookId,
        chapterId
    });

    if (!chapter || !book) {
        return redirect("/");
    }

    // Helper to check if quiz exists
    const hasQuiz = !!chapter.quiz && Array.isArray(chapter.quiz) && chapter.quiz.length > 0;

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner variant="suceess" label="You have read this chapter." />
            )}

            {isLocked && (
                <Banner
                    variant="warning"
                    label="You need to purchase this book to read this chapter."
                />
            )}

            <div className="flex flex-col max-w-4xl mx-auto pb-20 px-4 mt-6">
                
                {/* Header Section */}
                <div className="flex flex-col gap-y-4 pb-4">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <h2 className="text-3xl font-bold">
                            {chapter.title}
                        </h2>

                        <div className="mt-4 md:mt-0">
                            {purchase ? (
                                <BookProgressButton
                                    chapterId={chapterId}
                                    bookId={bookId}
                                    nextChapterId={nextChapter?.id}
                                    isCompleted={!!userProgress?.isCompleted}
                                    // ✅ Pass hasQuiz to enforce logic
                                    hasQuiz={hasQuiz} 
                                />
                            ) : (
                                <BookEnrollButton
                                    bookId={bookId}
                                    price={book.price!}
                                />
                            )}
                        </div>
                    </div>

                    {/* Audio Player Section */}
                    {!isLocked && (
                        <div className="w-full flex items-center justify-end">
                            <AudioPlayer 
                                text={chapter.content}
                                initialVoice={userVoice}
                                bookId={bookId}
                                chapterId={chapterId}
                            />
                        </div>
                    )}
                </div>

                <Separator />

                {/* Content Section */}
                <div className="mt-6">
                    {isLocked ? (
                        <div className="flex flex-col items-center justify-center h-60 bg-slate-100 rounded-md gap-y-2 text-slate-500">
                            <Lock className="h-8 w-8" />
                            <p>This chapter is locked.</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {/* 1. Main Text Content */}
                            <div className="bg-white rounded-md border shadow-sm p-6 md:p-10"> 
                                <Preview value={chapter.content} />
                            </div>

                            {/* 2. Student Quiz Component */}
                            <StudentQuiz quizData={chapter.quiz} />
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between mt-8">
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