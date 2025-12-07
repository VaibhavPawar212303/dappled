import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: Promise<{ courseId: string }> }) => {
    const { courseId } = await params;  // ✅ Await params
    
    const course = await prisma.course.findUnique({
        where: {
            id: courseId  // ✅ Use courseId
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
    
    return redirect(`/course/${course.id}/chapters/${course.chapters[0].id}`)
}

export default CourseIdPage;