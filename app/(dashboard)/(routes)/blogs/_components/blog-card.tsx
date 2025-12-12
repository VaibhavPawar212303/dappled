"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
    id: string;
    title: string;
    imageUrl: string;
    tags: string[];
    createdAt: Date;
}

export const BlogCard = ({
    id,
    title,
    imageUrl,
    tags,
    createdAt
}: BlogCardProps) => {
    return (
        <Link href={`/blogs/${id}`}>
            <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full flex flex-col">
                <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                        fill
                        className="object-cover"
                        alt={title}
                        src={imageUrl || "/placeholder.jpg"} // Fallback image
                    />
                </div>
                <div className="flex flex-col pt-2 flex-1">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1">
                        {new Date(createdAt).toLocaleDateString()}
                    </p>

                    <div className="mt-auto pt-3 flex flex-wrap gap-2">
                        {tags && tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    )
}