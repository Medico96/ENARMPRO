import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { flashcard_id, dificultad } = body;

    // Calcular próxima revisión según algoritmo de repetición espaciada
    const intervalos = {
      facil: 7,
      media: 3,
      dificil: 1,
    };

    const dias = intervalos[dificultad as keyof typeof intervalos] || 1;
    const proximaRevision = new Date();
    proximaRevision.setDate(proximaRevision.getDate() + dias);

    // Actualizar o crear progreso
    const { data: existing } = await supabase
      .from('flashcard_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('flashcard_id', flashcard_id)
      .single();

    let result;

    if (existing) {
      // Actualizar
      const { data, error } = await supabase
        .from('flashcard_progress')
        .update({
          veces_vista: existing.veces_vista + 1,
          ultima_vez_vista: new Date().toISOString(),
          dificultad,
          proxima_revision: proximaRevision.toISOString(),
          intervalo_dias: dias,
        })
        .eq('user_id', session.user.id)
        .eq('flashcard_id', flashcard_id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Crear
      const { data, error } = await supabase
        .from('flashcard_progress')
        .insert({
          user_id: session.user.id,
          flashcard_id,
          veces_vista: 1,
          ultima_vez_vista: new Date().toISOString(),
          dificultad,
          proxima_revision: proximaRevision.toISOString(),
          intervalo_dias: dias,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    // Registrar sesión de estudio
    await supabase.from('study_sessions').insert({
      user_id: session.user.id,
      tipo: 'flashcards',
      duracion: 1, // aproximadamente 1 minuto por flashcard
      flashcards_revisadas: 1,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obtener flashcards pendientes de revisión
    const { data: pendientes, error } = await supabase
      .from('flashcard_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .lte('proxima_revision', new Date().toISOString())
      .order('proxima_revision', { ascending: true })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ success: true, data: pendientes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
