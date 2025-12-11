import { getBookProgress } from "@/actions/get-book-progress"; // ✅ Import the new action
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookNavbar } from "./ _components/book-navbar";
import { BookSidebar } from "./ _components/book-sidebar";


const BookLayout = async ({ 
  children, 
  params 
}: { 
  children: React.ReactNode
  params: Promise<{ bookId: string }>
}) => {
    const { userId } = await auth();
    const { bookId } = await params;
    
    if (!userId) {
        return redirect('/');
    }
    
    const book = await prisma.book.findUnique({
        where: {
            id: bookId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgress: {
                        where: {
                            userId
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    });

    if (!book) {
        return redirect('/');
    }

    // ✅ Use getBookProgress instead of getProgress
    const progressCount = await getBookProgress(userId, book.id);

    const purchase = await prisma.bookPurchase.findUnique({
        where: {
            userId_bookId: {
                userId,
                bookId: book.id,
            }
        }
    });

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <BookNavbar
                    course={book}
                    progressCount={progressCount}
                    purchase={purchase}
                />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <BookSidebar
                    course={book}
                    progressCount={progressCount}
                    purchase={purchase}
                />
            </div>
            <main className="md:pl-80 h-full mt-2">
                {children}
            </main>
        </div>
    )
}

export default BookLayout;