import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format_type = searchParams.get('format') || 'json'; // json, csv, pdf

    // Obtener todos los datos del usuario
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    const { data: simuladores } = await supabase
      .from('simuladores')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', session.user.id);

    const { data: studySessions } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('session_date', { ascending: false });

    const exportData = {
      profile: {
        email: profile?.email,
        nombre: profile?.full_name,
        especialidad: profile?.specialty,
        fecha_examen: profile?.exam_date,
        plan: profile?.subscription_tier,
        fecha_registro: profile?.created_at,
      },
      estadisticas: {
        simuladores_completados: stats?.total_simuladores || 0,
        preguntas_resueltas: stats?.total_preguntas_resueltas || 0,
        promedio_aciertos: stats?.promedio_aciertos || 0,
        racha_dias: stats?.racha_dias || 0,
        tiempo_total_estudio_horas: Math.floor((stats?.tiempo_total_estudio || 0) / 60),
        mejor_especialidad: stats?.mejor_especialidad,
        peor_especialidad: stats?.peor_especialidad,
      },
      simuladores: simuladores?.map((s) => ({
        fecha: format(new Date(s.created_at), 'dd/MM/yyyy'),
        tipo: s.tipo,
        especialidad: s.especialidad,
        preguntas: s.total_preguntas,
        correctas: s.preguntas_correctas,
        porcentaje: s.porcentaje,
        tiempo_minutos: Math.floor((s.tiempo_total || 0) / 60),
      })) || [],
      logros: achievements?.map((a) => ({
        nombre: a.achievement_name,
        descripcion: a.description,
        fecha: format(new Date(a.unlocked_at), 'dd/MM/yyyy'),
      })) || [],
      sesiones_estudio: studySessions?.map((s) => ({
        fecha: format(new Date(s.session_date), 'dd/MM/yyyy'),
        tipo: s.tipo,
        duracion_minutos: s.duracion,
        preguntas: s.preguntas_respondidas,
        flashcards: s.flashcards_revisadas,
      })) || [],
      fecha_export: format(new Date(), 'dd/MM/yyyy HH:mm'),
    };

    if (format_type === 'csv') {
      // Generar CSV
      let csv = 'ENARM Pro - Export de Progreso\n\n';
      csv += 'ESTADÍSTICAS GENERALES\n';
      csv += 'Métrica,Valor\n';
      Object.entries(exportData.estadisticas).forEach(([key, value]) => {
        csv += `${key},${value}\n`;
      });

      csv += '\n\nSIMULADORES\n';
      csv += 'Fecha,Tipo,Especialidad,Preguntas,Correctas,Porcentaje,Tiempo (min)\n';
      exportData.simuladores.forEach((s) => {
        csv += `${s.fecha},${s.tipo},${s.especialidad},${s.preguntas},${s.correctas},${s.porcentaje},${s.tiempo_minutos}\n`;
      });

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="enarm-pro-export-${Date.now()}.csv"`,
        },
      });
    }

    // JSON por defecto
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="enarm-pro-export-${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
