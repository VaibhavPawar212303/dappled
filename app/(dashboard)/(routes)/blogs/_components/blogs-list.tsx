"use client";

import { Blog } from "@/generated/prisma/client";
import { BlogCard } from "./blog-card";

interface BlogsListProps {
    items: Blog[];
}

export const BlogsList = ({ items }: BlogsListProps) => {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <BlogCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.imageUrl!}
                        tags={item.tags}
                        createdAt={item.createdAt}
                    />
                ))}
            </div>
            {items.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No blogs found
                </div>
            )}
        </div>
    );
};