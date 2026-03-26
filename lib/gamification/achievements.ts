import { createServerClient } from '@/lib/supabase/server';

export async function checkAndUnlockAchievements(userId: string) {
  const supabase = createServerClient();

  // Obtener stats del usuario
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!stats) return;

  const achievements = [];

  // Check simuladores completados
  if (stats.total_simuladores === 1) achievements.push('first_simulador');
  if (stats.total_simuladores === 10) achievements.push('ten_simuladores');
  if (stats.total_simuladores === 50) achievements.push('fifty_simuladores');
  if (stats.total_simuladores === 100) achievements.push('hundred_simuladores');

  // Check racha
  if (stats.racha_dias === 7) achievements.push('week_streak');
  if (stats.racha_dias === 30) achievements.push('month_streak');
  if (stats.racha_dias === 100) achievements.push('hundred_days');

  // Check promedio
  const { data: lastSimulador } = await supabase
    .from('simuladores')
    .select('porcentaje')
    .eq('user_id', userId)
    .eq('estado', 'finalizado')
    .order('finished_at', { ascending: false })
    .limit(1)
    .single();

  if (lastSimulador) {
    if (lastSimulador.porcentaje === 100) achievements.push('perfect_score');
    if (lastSimulador.porcentaje >= 90) achievements.push('ninety_percent');
  }

  // Check flashcards
  const { count: flashcardsCount } = await supabase
    .from('flashcard_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (flashcardsCount === 1000) achievements.push('thousand_flashcards');

  // Check todas las especialidades
  const { data: simuladoresPorEspecialidad } = await supabase
    .from('simuladores')
    .select('especialidad')
    .eq('user_id', userId)
    .eq('estado', 'finalizado');

  const especialidadesUnicas = new Set(
    simuladoresPorEspecialidad?.map((s) => s.especialidad) || []
  );

  if (especialidadesUnicas.size >= 20) achievements.push('all_specialties');

  // Desbloquear achievements que aún no tiene
  const { data: existing } = await supabase
    .from('achievements')
    .select('achievement_type')
    .eq('user_id', userId);

  const existingTypes = new Set(existing?.map((a) => a.achievement_type) || []);
  const newAchievements = achievements.filter((a) => !existingTypes.has(a));

  if (newAchievements.length > 0) {
    // Obtener definiciones
    const { data: definitions } = await supabase
      .from('achievement_definitions')
      .select('*')
      .in('id', newAchievements);

    // Insertar achievements
    const achievementsToInsert = definitions?.map((def) => ({
      user_id: userId,
      achievement_type: def.id,
      achievement_name: def.name,
      description: def.description,
    })) || [];

    await supabase.from('achievements').insert(achievementsToInsert);

    return { newAchievements: achievementsToInsert, count: achievementsToInsert.length };
  }

  return { newAchievements: [], count: 0 };
}

export async function getLeaderboard(limit: number = 100) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('leaderboard')
    .select('*, profiles(full_name, avatar_url)')
    .order('rank', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data;
}

export async function getUserRank(userId: string) {
  const supabase = createServerClient();

  const { data } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('user_id', userId)
    .single();

  return data;
}
