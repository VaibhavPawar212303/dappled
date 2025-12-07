import { IconBadge } from '@/components/icon-badge';
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server';
import { CircleDollarSign, File, LayoutDashboard, ListCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { TitleForm } from './_components/title-form';
import { DescriptionForm } from './_components/description-form';
import { ImageForm } from './_components/image-form';
import { CategoryForm } from './_components/category-form';
import { PriceForm } from './_components/price-form';
import { AttachmentForm } from './_components/attachment-form';
import { ChaptersForm } from './_components/chapters-form';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
    const { userId } = await auth();
    const { courseId } = await params;

    if (!userId) {
        return redirect("/");
    }
    const course = await prisma.course.findUnique({
        where: {
            id: courseId
        }
    });

    if (!course) {
        return redirect("/");
    }

    // Fetch categories from the database
    const categories = await prisma.category.findMany();

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;


    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>
                        Course Setup
                    </h1>
                    <span>
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className='text-xl'>
                            Customize your course
                        </h2>
                    </div>
                    <ImageForm
                        initialData={course}
                        courseId={courseId}
                    />
                    <TitleForm
                        initialData={course}
                        courseId={courseId}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={courseId}
                    />
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category: { name: any; id: any; }) => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListCheck} />
                        <h2 className="text-xl">
                            Course chapters
                        </h2>
                    </div>
                    {/* <div>
                        <ChaptersForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div> */}
                    <div>
                        {/* <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl">Sell your course</h2>
                        </div> */}
                        <PriceForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        {/* <div className="flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2 className="text-xl">Resources & Attachments</h2>
                        </div>
                        <AttachmentForm
                            initialData={{
                                ...course,
                                attachmets: course.attachmentId
                            }}
                            courseId={course.id}
                        /> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseIdPage