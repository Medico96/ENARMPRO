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
    const { tipo, especialidad, total_preguntas } = body;

    // Crear nuevo simulador
    const { data: simulador, error } = await supabase
      .from('simuladores')
      .insert({
        user_id: session.user.id,
        tipo,
        especialidad,
        total_preguntas,
        estado: 'en_progreso',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: simulador });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
