import { getProgress } from "@/actions/get-progress";
import { category, Course } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";  // ✅ Change from prisma to db

type CourseWithProgressWithCategory = Course & {
    category: category | null;
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
        const courses = await prisma.course.findMany({  // ✅ Change from prisma to db
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
            courses.map(async (course: typeof courses[number]) => {
                if (course.purchases.length === 0) {  // ✅ Change courses.length to course.purchase.length
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