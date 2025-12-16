import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Preview } from "@/components/preview";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "../_components/share-button";


const BlogIdPage = async ({ 
    params 
}: { 
    params: Promise<{ blogId: string }> 
}) => {
    const { blogId } = await params;

    // ✅ REMOVED: const { userId } = await auth();
    // ✅ REMOVED: if (!userId) return redirect("/");

    const blog = await prisma.blog.findUnique({
        where: {
            id: blogId,
            isPublished: true, // 🔒 IMPORTANT: Only show published blogs
        }
    });

    if (!blog) {
        return redirect("/");
    }

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
                <Link 
                    href="/blogs" 
                    className="flex items-center text-sm hover:opacity-75 transition text-slate-500"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to all articles
                </Link>

                {/* ✅ Add Share Button here */}
                <ShareButton />
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                    {blog.title}
                </h1>

                <div className="flex items-center gap-x-4 text-slate-500 text-sm">
                    <div className="flex items-center gap-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-sm">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            {blog.imageUrl && (
                <div className="relative w-full aspect-video mt-6 rounded-md overflow-hidden shadow-sm border">
                    <Image
                        fill
                        className="object-cover"
                        src={blog.imageUrl}
                        alt={blog.title}
                    />
                </div>
            )}

            <Separator className="my-8" />

            <div className="pb-10">
                <Preview value={blog.content} />
            </div>
        </div>
    );
}

export default BlogIdPage;