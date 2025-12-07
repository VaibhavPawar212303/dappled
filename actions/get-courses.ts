import { getProgress } from "@/actions/get-progress";
import { category, Course } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    chapters: { id: string }[];
    progress: number | null
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ({
    userId, title, categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await prisma.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const CourseWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async (course: typeof courses[number]) => {  // ✅ Add explicit type
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    }
                }
                const progressPercentage = await getProgress(userId, course.id);
                return {
                    ...course,
                    progress: progressPercentage,
                }
            })
        );
        return CourseWithProgress;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}