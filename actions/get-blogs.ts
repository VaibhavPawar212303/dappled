
import { prisma } from "@/lib/db";
import { Blog } from "@prisma/client";

type GetBlogs = {
    title?: string;
}

export const getBlogs = async ({
    title
}: GetBlogs): Promise<Blog[]> => {
    try {
        const blogs = await prisma.blog.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title,
                },
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return blogs;
    } catch (error) {
        console.log("[GET_BLOGS]", error);
        return [];
    }
}