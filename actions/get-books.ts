import { category, Book } from "@prisma/client";
import { prisma } from "@/lib/db";

// Define the type to include relations
type BookWithCategory = Book & {
    category: category | null;
    chapters: { id: string }[];
}

type GetBooks = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getBooks = async ({
    userId, title, categoryId
}: GetBooks): Promise<BookWithCategory[]> => {
    try {
        const books = await prisma.book.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return books;
    } catch (error) {
        console.log("[GET_BOOKS]", error);
        return [];
    }
}