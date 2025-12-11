import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request,{ params }: { params: Promise<{ bookId: string }> }) {
    try {
        const user = await currentUser();
        const { bookId } = await params;
        if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const book = await prisma.book.findUnique({
            where: {
                id: bookId,
                isPublished: true,
            }
        });
        const purchase = await prisma.bookPurchase.findUnique({
            where: {
                userId_bookId: {
                    userId: user.id,
                    bookId: bookId,
                }
            }
        });
        if (purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }
        if (!book) {
            return new NextResponse("Book not found", { status: 404 });
        }
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: book.title,
                        description: book.description || undefined, // <-- FIX HERE
                    },
                    unit_amount: Math.round(book.price! * 100),
                }
            }
        ];

        let stripeCustomer = await prisma.stripeCustomer.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                stripeCustomerId: true,
            }
        });

        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
                metadata: {
                    userId: user.id,
                }
            });

            stripeCustomer = await prisma.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id,
                }
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items,
            mode: "payment",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/books/${bookId}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/books/${bookId}?canceled=1`,
            metadata: {
                bookId: book.id,
                userId: user.id,
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.log("[BOOK_ID_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}