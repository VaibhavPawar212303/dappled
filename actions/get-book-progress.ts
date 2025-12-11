import { prisma } from "@/lib/db";

export const getBookProgress = async (
  userId: string,
  bookId: string
): Promise<number> => {
  try {
    const publishedChapters = await prisma.bookChapter.findMany({
      where: {
        bookId: bookId,
        isPublished: true,
      },
      select: {
        id: true,
      }
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    // ✅ Prevent division by zero (0/0 = NaN)
    if (publishedChapterIds.length === 0) {
      return 0;
    }

    const validCompletedChapters = await prisma.bookUserProgress.count({
      where: {
        userId: userId,
        bookChapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      }
    });

    const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_BOOK_PROGRESS]", error);
    return 0;
  }
}