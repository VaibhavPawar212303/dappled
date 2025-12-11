import { prisma } from "@/lib/db";
import { Categories } from "../search/_components/categories"; // Assuming shared categories component
import { SearchInput } from "@/components/search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBooks } from "@/actions/get-books";
import { BooksList } from "../books/_components/books-list";

interface BooksPageProps {
    searchParams: Promise<{
        title?: string;
        categoryId?: string
    }>
}

const BookPage = async ({ searchParams }: BooksPageProps) => {
    const { userId } = await auth();
    const params = await searchParams;

    if (!userId) {
        return redirect("/");
    }

    // Fetch categories to display filter pills
    const categories = await prisma.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    // Fetch books based on search params
    const books = await getBooks({ userId, ...params });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories
                    items={categories}
                />
                <BooksList items={books} />
            </div>
        </>
    );
}

export default BookPage;