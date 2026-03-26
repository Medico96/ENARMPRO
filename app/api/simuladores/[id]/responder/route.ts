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
    const { pregunta_id, opcion_seleccionada, es_correcta, tiempo_respuesta } = body;

    // Verificar que el simulador pertenece al usuario
    const { data: simulador } = await supabase
      .from('simuladores')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (!simulador) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Guardar respuesta
    const { data: respuesta, error } = await supabase
      .from('simulador_respuestas')
      .insert({
        simulador_id: params.id,
        pregunta_id,
        opcion_seleccionada,
        es_correcta,
        tiempo_respuesta,
      })
      .select()
      .single();

    if (error) throw error;

    // Actualizar contador del simulador
    const nuevasCorrectas = es_correcta ? simulador.preguntas_correctas + 1 : simulador.preguntas_correctas;
    const nuevasIncorrectas = !es_correcta && opcion_seleccionada !== null 
      ? simulador.preguntas_incorrectas + 1 
      : simulador.preguntas_incorrectas;

    await supabase
      .from('simuladores')
      .update({
        preguntas_correctas: nuevasCorrectas,
        preguntas_incorrectas: nuevasIncorrectas,
      })
      .eq('id', params.id);

    return NextResponse.json({ success: true, data: respuesta });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
