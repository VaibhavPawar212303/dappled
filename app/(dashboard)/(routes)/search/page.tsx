import { prisma } from "@/lib/db";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { auth } from "@clerk/nextjs/server";
import { getCourses } from "@/actions/get-courses";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";

interface SearchPageProps {
    searchParams: Promise<{
        title?: string;
        categoryId?: string
    }>
}

const Searchpage = async ({ searchParams }: SearchPageProps) => {
    const { userId } = await auth();
    const params = await searchParams;  // ✅ Await searchParams

    if (!userId) {
        return redirect("/");
    }

    const catrgories = await prisma.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const courses = await getCourses({ userId, ...params })  // ✅ Use params

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories
                    items={catrgories}
                />
                <CoursesList items={courses} />
            </div>
        </>
    );
}

export default Searchpage;