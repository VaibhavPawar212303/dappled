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

    if (event.type === 'checkout.session.completed') {
        if (!userId || !courseId) {
            console.error('Missing userId or courseId in session metadata');
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        try {
            await prisma.purchase.create({
                data: {
                    userId: userId,
                    courseId: courseId,
                },
            })
        } catch (error) {
            console.error('Error updating course progress:', error);
            return NextResponse.json({ error: 'Database Error' }, { status: 500 });
        }
    } else {
        return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 });
    }

    return new NextResponse(null, { status: 200 });
}