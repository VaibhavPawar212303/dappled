import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ bookId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { bookId, chapterId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 1. Verify Book Ownership
        const ownBook = await prisma.book.findUnique({
            where: {
                id: bookId,
                userId,
            },
        });

        if (!ownBook) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 2. Verify Chapter Existence
        const chapter = await prisma.bookChapter.findUnique({
            where: {
                id: chapterId,
                bookId: bookId,
            }
        });

        if (!chapter) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // 3. Delete the Chapter (Use bookChapter table)
        const deletedChapter = await prisma.bookChapter.delete({
            where: {
                id: chapterId
            }
        });

        // 4. Check if the Book still has any published chapters
        const publishedChaptersInBook = await prisma.bookChapter.findMany({
            where: {
                bookId: bookId, // ✅ Check the BOOK, not the chapter ID
                isPublished: true
            }
        });

        // 5. If no published chapters remain, unpublish the book
        if (!publishedChaptersInBook.length) {
            await prisma.book.update({
                where: {
                    id: bookId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.error("[BOOK_CHAPTER_DELETE] Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ bookId: string; chapterId: string }> }
) {
    try {
        const { userId } = await auth();
        const { bookId, chapterId } = await params;
        
        // ✅ Separate quizData (string) so we can parse it
        const { isPublished, quizData, ...values } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownBook = await prisma.book.findUnique({
            where: {
                id: bookId,
                userId,
            },
        });

        if (!ownBook) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // ✅ Handle Quiz Parsing (if provided)
        let parsedQuiz = undefined;
        if (quizData) {
            try {
                parsedQuiz = JSON.parse(quizData);
            } catch (e) {
                console.log("Failed to parse quiz JSON", e);
                // Optionally return 400 here, or just ignore and update other fields
            }
        }

        const chapter = await prisma.bookChapter.update({
            where: {
                id: chapterId,
                bookId: bookId,
            },
            data: {
                ...values,
                // ✅ Update quiz column if parsed successfully
                ...(parsedQuiz && { quiz: parsedQuiz }),
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.error("[BOOK_CHAPTER_PATCH] Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}