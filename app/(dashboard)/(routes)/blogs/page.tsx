import { SearchInput } from "@/components/search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBlogs } from "@/actions/get-blogs";
import { BlogsList } from "./_components/blogs-list";

interface BlogsPageProps {
    searchParams: Promise<{
        title?: string;
    }>
}

const BlogsPage = async ({ searchParams }: BlogsPageProps) => {
    const { userId } = await auth();
    const params = await searchParams;

    if (!userId) {
        return redirect("/");
    }

    // Fetch blogs based on search params (Title only)
    const blogs = await getBlogs({ ...params });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Latest Articles</h1>
                <BlogsList items={blogs} />
            </div>
        </>
    );
}

export default BlogsPage;