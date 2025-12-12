import { IconBadge } from '@/components/icon-badge';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { LayoutDashboard, FileText, Image as ImageIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

// You need to adapt your TitleForm to accept 'blogId' or use a specific BlogTitleForm
import { TitleForm } from './_components/title-form';
import { ImageForm } from './_components/image-form';

// We need a specific form for the main body content
import { BlogContentForm } from './_components/blog-content-form';
import { Actions } from './_components/actions';


const BlogIdPage = async ({ params }: { params: Promise<{ blogId: string }> }) => {
    const { userId } = await auth();
    const { blogId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const blog = await prisma.blog.findUnique({
        where: {
            id: blogId,
            userId
        }
    });

    if (!blog) {
        return redirect("/");
    }

    // Required fields for a Blog to be publishable
    const requiredFields = [
        blog.title,
        blog.content, // This checks if the content string is not empty
        blog.imageUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>
                        Blog Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
                {/* Publish/Unpublish Actions */}
                <Actions
                    disabled={!isComplete}
                    blogId={blogId} // You might need to rename this prop in Actions to 'id'
                    isPublished={blog.isPublished}
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div className="space-y-6">
                    <div>
                        <div className='flex items-center gap-x-2'>
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className='text-xl'>
                                Customize your blog
                            </h2>
                        </div>

                        {/* Title Form */}
                        <TitleForm
                            initialData={blog}
                            blogId={blogId} // Pass blogId (ensure component handles it)
                        />

                        {/* Image Form */}
                        <ImageForm
                            initialData={blog}
                            blogId={blogId}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={FileText} />
                            <h2 className="text-xl">
                                Blog Content
                            </h2>
                        </div>
                        {/* 
                           This is the most important part of the blog. 
                           It uses the Tiptap editor we built.
                        */}
                        <BlogContentForm
                            initialData={blog}
                            blogId={blog.id}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogIdPage;