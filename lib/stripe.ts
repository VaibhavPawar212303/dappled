import Strip from 'stripe';
export const stripe = new Strip(process.env.STRIPE_API_KEY!, {
    apiVersion: '2025-04-30.basil',
    typescript: true,
})