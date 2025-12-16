"use client";

import { category, Book } from "@prisma/client";
import { BookCard } from "./book-card"; // We will create this next

type BookWithCategory = Book & {
    category: category | null;
    chapters: { id: string }[];
};

interface BooksListProps {
    items: BookWithCategory[];
}

export const BooksList = ({ items }: BooksListProps) => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <BookCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chaptersLength={item.chapters.length}
                        price={item.price!}
                        category={item.category?.name!}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No books found
                </div>
            )}
        </div>
    );
};