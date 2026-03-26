import { createServerClient } from '@/lib/supabase/server';

export async function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  // Guardar en tabla de analytics (crear esta tabla)
  await supabase.from('analytics_events').insert({
    user_id: session.user.id,
    event_name: eventName,
    properties,
    timestamp: new Date().toISOString(),
  });

  // También enviar a Vercel Analytics si está disponible
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('track', eventName, properties);
  }
}

export async function trackPageView(page: string) {
  await trackEvent('page_view', { page });
}

export async function trackSimuladorStarted(tipo: string, especialidad?: string) {
  await trackEvent('simulador_started', { tipo, especialidad });
}

export async function trackSimuladorCompleted(
  simuladorId: string,
  score: number,
  timeSpent: number
) {
  await trackEvent('simulador_completed', {
    simulador_id: simuladorId,
    score,
    time_spent: timeSpent,
  });
}

export async function trackFlashcardReviewed(flashcardId: string, difficulty: string) {
  await trackEvent('flashcard_reviewed', {
    flashcard_id: flashcardId,
    difficulty,
  });
}

export async function trackGPCStudied(gpcCode: string, duration: number) {
  await trackEvent('gpc_studied', {
    gpc_code: gpcCode,
    duration,
  });
}
