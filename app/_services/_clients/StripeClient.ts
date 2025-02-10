import { loadStripe } from '@stripe/stripe-js';

export const getStripe = async () => {
  const stripe = await loadStripe(process.env.STRIPE_API_KEY!);
  return stripe;
};
