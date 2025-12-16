
import { CourseCard } from "@/components/course-card";
import { category, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
    category: category | null;
    chapters: { id: string }[];
    progress: number | null;
}
interface CourseListProps {
    items: CourseWithProgressWithCategory[]
}

export const CoursesList = ({ items }: CourseListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-4 md:grid-cols-4 lg:grid-col-3 xl:grid-col-4 2xl::grid-col-4 gap-4">
                {items.map((item) => (
                    <CourseCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        chapterLength={item.chapters.length}
                        price={item.price!}
                        progress={item.progress}
                        category={item?.category?.name!}
                    />
                ))}
            </div>
            {
                items.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground mt-10">No Courses Found</div>
                )
            }
        </div>
    )
}