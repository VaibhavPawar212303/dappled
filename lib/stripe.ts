import Strip from 'stripe';
export const stripe = new Strip(process.env.STRIPE_API_KEY!, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
})