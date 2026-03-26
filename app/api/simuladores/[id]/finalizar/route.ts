import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tiempo_total } = body;

    // Obtener el simulador
    const { data: simulador } = await supabase
      .from('simuladores')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (!simulador) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Calcular porcentaje
    const porcentaje = (simulador.preguntas_correctas / simulador.total_preguntas) * 100;
    const sinContestar = simulador.total_preguntas - simulador.preguntas_correctas - simulador.preguntas_incorrectas;

    // Actualizar simulador
    const { data: simuladorFinalizado, error } = await supabase
      .from('simuladores')
      .update({
        estado: 'finalizado',
        porcentaje,
        tiempo_total,
        preguntas_sin_contestar: sinContestar,
        finished_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    // Registrar sesión de estudio
    await supabase.from('study_sessions').insert({
      user_id: session.user.id,
      tipo: 'simulador',
      duracion: Math.floor(tiempo_total / 60),
      preguntas_respondidas: simulador.total_preguntas,
    });

    // Verificar logros
    await checkAchievements(session.user.id, simuladorFinalizado);

    return NextResponse.json({ success: true, data: simuladorFinalizado });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function checkAchievements(userId: string, simulador: any) {
  const supabase = createServerClient();

  // Logro: Primer simulador completado
  const { data: totalSimuladores } = await supabase
    .from('simuladores')
    .select('id')
    .eq('user_id', userId)
    .eq('estado', 'finalizado');

  if (totalSimuladores?.length === 1) {
    await supabase.from('achievements').insert({
      user_id: userId,
      achievement_type: 'first_simulador',
      achievement_name: '🎯 Primer Simulador',
      description: 'Completaste tu primer simulador completo',
    });
  }

  // Logro: Simulador perfecto
  if (simulador.porcentaje === 100) {
    await supabase.from('achievements').insert({
      user_id: userId,
      achievement_type: 'perfect_score',
      achievement_name: '💯 Simulador Perfecto',
      description: '100% de aciertos en un simulador',
    });
  }

  // Logro: 10 simuladores completados
  if (totalSimuladores?.length === 10) {
    await supabase.from('achievements').insert({
      user_id: userId,
      achievement_type: 'ten_simuladores',
      achievement_name: '🏆 Dedicación Total',
      description: 'Completaste 10 simuladores',
    });
  }
}
