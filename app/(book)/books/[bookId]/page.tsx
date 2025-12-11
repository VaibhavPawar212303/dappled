import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

const BookIdPage = async ({ params }: { params: Promise<{ bookId: string }> }) => {
    const { bookId } = await params;  // ✅ Await params
    
    const course = await prisma.book.findUnique({
        where: {
            id: bookId  // ✅ Use courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                orderBy: {
                    position: "asc"
                }
            },
        }
    });
    
    if (!course) {
        return redirect('/');
    }
    
    return redirect(`/books/${course.id}/chapters/${course.chapters[0].id}`)
}

export default BookIdPage;