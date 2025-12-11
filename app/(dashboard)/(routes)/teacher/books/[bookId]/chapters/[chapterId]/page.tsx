import { IconBadge } from "@/components/icon-badge";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Book, Eye, LayoutDashboard } from "lucide-react"; // Removed Video icon as books are text
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterAccess } from "./_components/chapter-access-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";
import { BookChapterContentForm } from "../../_components/description-form";

const ChapterIdPage = async ({ params }: { params: Promise<{ bookId: string; chapterId: string }> }) => {
    const { userId } = await auth();
    const { bookId, chapterId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const chapter = await prisma.bookChapter.findUnique({
        where: {
            id: chapterId,
            bookId: bookId
        },
    })

    if (!chapter) {
        return redirect("/");
    }

    const requiredFields = [
        chapter.title,
        chapter.content,
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            <div className="mr-10">
                {!chapter.isPublished && (
                    <Banner
                        variant="warning"
                        label="This chapter is unpublished. It will not be visible in the book"
                    />
                )}
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link href={`/teacher/books/${bookId}`} className="flex items-center text-sm hover:opacity-75 transition mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to book setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter Creation
                                </h1>
                                <span className="text-sm text-slate-700">
                                    complete all fields {completionText}
                                </span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={bookId}
                                chapterId={chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your chapter
                                </h2>
                            </div>

                            <ChapterTitleForm
                                initialData={chapter} // Ensure this component accepts generic { title: string } or BookChapter
                                courseId={bookId}
                                chapterId={chapterId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">Access settings</h2>
                            </div>
                            <ChapterAccess
                                initialData={chapter}
                                courseId={bookId}
                                chapterId={chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Book} />
                            <h2 className="text-xl">Add chapter describtion</h2>
                        </div>
                        <div>
                            <BookChapterContentForm
                                initialData={chapter}
                                bookId={bookId}
                                chapterId={chapterId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChapterIdPage;