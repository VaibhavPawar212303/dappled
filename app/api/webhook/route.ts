import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.text();
    const Signature = (await headers()).get("Stripe-signature") as string;

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            Signature,
            process.env.STRIPE_WEBHOOK_SECRET as string
        );
    } catch (err) {
        console.error('Error constructing Stripe event:', err);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;
    const bookId = session?.metadata?.bookId; // ✅ Extract bookId

    if (event.type === 'checkout.session.completed') {
        
        // 1. Ensure we at least have a User ID
        if (!userId) {
            console.error('Missing userId in session metadata');
            return NextResponse.json({ error: 'Missing userId metadata' }, { status: 400 });
        }

        try {
            // 2. Handle COURSE Purchase
            if (courseId) {
                await prisma.purchase.create({
                    data: {
                        userId: userId,
                        courseId: courseId,
                    },
                });
            } 
            // 3. Handle BOOK Purchase
            else if (bookId) {
                await prisma.bookPurchase.create({
                    data: {
                        userId: userId,
                        bookId: bookId,
                    },
                });
            } 
            // 4. Handle Missing Data (Neither course nor book)
            else {
                console.error('Missing courseId OR bookId in session metadata');
                return NextResponse.json({ error: 'Missing product metadata' }, { status: 400 });
            }

        } catch (error) {
            console.error('Error updating database:', error);
            // It's often better to return 200 even on error to stop Stripe from retrying infinitely
            // if the error is due to a duplicate key (already purchased), 
            // but for now, we keep your 500 status.
            return NextResponse.json({ error: 'Database Error' }, { status: 500 });
        }
    } else {
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}