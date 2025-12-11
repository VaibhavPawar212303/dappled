import { IconBadge } from '@/components/icon-badge';
import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server';
import { CircleDollarSign, LayoutDashboard, ListCheck } from 'lucide-react';
import { redirect } from 'next/navigation';

// You will likely need to duplicate/refactor your existing forms to accept 'bookId' 
// or accept a generic 'apiUrl' prop.
import { TitleForm } from './_components/title-form';

import { ImageForm } from './_components/image-form';
import { CategoryForm } from './_components/category-form';
import { PriceForm } from './_components/price-form';
import { ChaptersForm } from './_components/chapters-form';


// You will need to create this specific component for Book Chapters
// import { BookChaptersForm } from './_components/book-chapters-form'; 


const BookIdPage = async ({ params }: { params: Promise<{ bookId: string }> }) => {
    const { userId } = await auth();
    const { bookId } = await params;

    if (!userId) {
        return redirect("/");
    }

    const book = await prisma.book.findUnique({
        where: {
            id: bookId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                },
            },
        }
    })

    if (!book) {
        return redirect("/");
    }

    const categories = await prisma.category.findMany();

    // Required fields based on your Book Schema
    const requiredFields = [
        book.title,
        book.description,
        book.imageUrl,
        book.price,
        book.categoryId,
        book.chapters.some(chapter => chapter.isPublished)
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>
                        Book Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        Complete all fields {completionText}
                    </span>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className='text-xl'>
                            Customize your book
                        </h2>
                    </div>
                    <TitleForm
                        initialData={book}
                        bookId={bookId}
                    />
                    <ChaptersForm
                        initialData={book}
                        bookId={bookId}
                    />
                    <ImageForm
                        initialData={book}
                        bookId={bookId}
                    />
                    <CategoryForm
                        initialData={book}
                        bookId={bookId}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={ListCheck} />
                        <h2 className="text-xl">
                            Book chapters
                        </h2>
                    </div>
                    <div>
                        {/* New Component needed for Book Chapters */}
                        <ChaptersForm
                            initialData={book}
                            bookId={bookId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2 className="text-xl">Sell your book</h2>
                        </div>
                        <PriceForm
                            initialData={book}
                            bookId={bookId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookIdPage;