import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const STRIPE_PLANS = {
  pro_monthly: {
    priceId: 'price_pro_monthly_id',
    amount: 499,
    interval: 'month',
  },
  pro_annual: {
    priceId: 'price_pro_annual_id',
    amount: 3588,
    interval: 'year',
  },
  elite_monthly: {
    priceId: 'price_elite_monthly_id',
    amount: 899,
    interval: 'month',
  },
  elite_annual: {
    priceId: 'price_elite_annual_id',
    amount: 6468,
    interval: 'year',
  },
};
