import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/config';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutCompleted(session);
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionDeleted(deletedSubscription);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: any) {
  const userId = session.client_reference_id;
  const planId = session.metadata.planId;

  // Determinar tier
  let tier: 'pro' | 'elite' = 'pro';
  if (planId.includes('elite')) {
    tier = 'elite';
  }

  // Calcular fecha de expiración
  const expiresAt = new Date();
  if (planId.includes('annual')) {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  // Actualizar perfil
  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_status: 'active',
      subscription_expires_at: expiresAt.toISOString(),
    })
    .eq('id', userId);

  // Registrar pago
  await supabaseAdmin.from('payments').insert({
    user_id: userId,
    stripe_payment_id: session.payment_intent,
    amount: session.amount_total / 100,
    currency: session.currency.toUpperCase(),
    plan: tier,
    billing_period: planId.includes('annual') ? 'annual' : 'monthly',
    status: 'completed',
    payment_method: 'card',
  });

  // Enviar email de bienvenida
  await sendWelcomeEmail(userId, tier);
}

async function handleSubscriptionUpdated(subscription: any) {
  // Manejar cambios en la suscripción
  console.log('Subscription updated:', subscription);
}

async function handleSubscriptionDeleted(subscription: any) {
  // Manejar cancelación de suscripción
  const userId = subscription.metadata.userId;

  await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: 'canceled',
    })
    .eq('id', userId);
}

async function sendWelcomeEmail(userId: string, tier: string) {
  // Implementar con Resend (siguiente sección)
  console.log(`Sending welcome email to user ${userId} for tier ${tier}`);
}
