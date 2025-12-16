import { prisma } from "@/lib/db";
import { BookUserProgress, BookPurchase, BookChapter, Book } from "@prisma/client"; // Adjust path if needed

interface GetBookChapterProps {
    userId: string;
    bookId: string;
    chapterId: string;
}

// Explicitly define the return type so TypeScript knows userProgress has 'isCompleted'
interface GetBookChapterResult {
    chapter: BookChapter | null;
    book: Book | null;
    purchase: BookPurchase | null;
    userProgress: BookUserProgress | null; // <--- This fixes the "never" error
    isLocked: boolean;
    nextChapter: BookChapter | null;
}

export const getBookChapter = async ({
    userId,
    bookId,
    chapterId,
}: GetBookChapterProps): Promise<GetBookChapterResult> => {
    try {
        const purchase = await prisma.bookPurchase.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                }
            }
        });

        const book = await prisma.book.findUnique({
            where: {
                id: bookId,
            },
        });

        const chapter = await prisma.bookChapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });

        if (!chapter || !book) {
            throw new Error("Chapter or Book not found");
        }

        const userProgress = await prisma.bookUserProgress.findUnique({
            where: {
                userId_bookChapterId: {
                    userId,
                    bookChapterId: chapterId,
                }
            }
        });

        const isLocked = !chapter.isFree && !purchase;

        const nextChapter = await prisma.bookChapter.findFirst({
            where: {
                bookId: bookId,
                isPublished: true,
                position: {
                    gt: chapter.position,
                },
            },
            orderBy: {
                position: "asc",
            },
        });

        return {
            chapter,
            book,
            purchase,
            userProgress,
            isLocked,
            nextChapter,
        };
    } catch (error) {
        console.log("[GET_BOOK_CHAPTER]", error);
        return {
            chapter: null,
            book: null,
            purchase: null,
            userProgress: null,
            isLocked: true,
            nextChapter: null,
        };
    }
};