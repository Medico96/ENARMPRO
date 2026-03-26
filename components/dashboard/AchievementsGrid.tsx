'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Award, Lock } from 'lucide-react';

export default function AchievementsGrid() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    // Obtener todas las definiciones
    const { data: definitions } = await supabase
      .from('achievement_definitions')
      .select('*')
      .order('points', { ascending: false });

    // Obtener achievements desbloqueados
    const { data: unlocked } = await supabase
      .from('achievements')
      .select('achievement_type')
      .eq('user_id', session.user.id);

    const unlockedSet = new Set(unlocked?.map((a) => a.achievement_type) || []);

    setAchievements(definitions || []);
    setUnlockedIds(unlockedSet);
    setLoading(false);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      comun: 'from-gray-500 to-gray-600',
      raro: 'from-blue-500 to-blue-600',
      epico: 'from-purple-500 to-purple-600',
      legendario: 'from-yellow-500 to-orange-600',
    };
    return colors[rarity as keyof typeof colors] || colors.comun;
  };

  if (loading) {
    return <div className="text-center py-8">Cargando achievements...</div>;
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-yellow-500/15 rounded-xl flex items-center justify-center">
          <Award className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Logros</h3>
          <p className="text-text-muted text-sm">
            {unlockedIds.size} / {achievements.length} desbloqueados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`relative group rounded-xl p-4 transition-all ${
                isUnlocked
                  ? 'bg-gradient-to-br ' + getRarityColor(achievement.rarity) + ' cursor-pointer hover:scale-105'
                  : 'bg-bg-tertiary border border-border opacity-50'
              }`}
            >
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-text-dim" />
                </div>
              )}

              <div className={`text-center ${!isUnlocked && 'blur-sm'}`}>
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <div className="font-semibold text-sm text-white mb-1">
                  {achievement.name}
                </div>
                <div className="text-xs text-white/80">
                  {achievement.description}
                </div>
                <div className="mt-2 text-xs font-bold text-yellow-300">
                  {achievement.points} pts
                </div>
              </div>

              {isUnlocked && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Award className="w-4 h-4 text-yellow-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
