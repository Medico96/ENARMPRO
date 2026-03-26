'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard, getUserRank } from '@/lib/gamification/achievements';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getLeaderboard(50);
    setLeaderboard(data);

    // Obtener rank del usuario actual
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      const rank = await getUserRank(session.user.id);
      setUserRank(rank);
    }

    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <Award className="w-5 h-5 text-text-muted" />;
  };

  if (loading) {
    return <div className="text-center py-8">Cargando leaderboard...</div>;
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Tabla de Líderes</h3>
            <p className="text-text-muted text-sm">Top 50 estudiantes</p>
          </div>
        </div>
      </div>

      {/* Tu posición */}
      {userRank && (
        <div className="p-6 bg-accent-primary/5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center text-white font-bold">
                #{userRank.rank}
              </div>
              <div>
                <div className="font-semibold">Tu posición</div>
                <div className="text-sm text-text-muted">
                  Nivel {userRank.level} • {userRank.total_points} puntos
                </div>
              </div>
            </div>
            <div className="text-accent-hover font-bold">
              {userRank.achievements_count} logros
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="max-h-[500px] overflow-y-auto">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.id}
            className={`flex items-center justify-between p-4 border-b border-border hover:bg-bg-tertiary transition-colors ${
              index < 3 ? 'bg-bg-tertiary/50' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 text-center">
                {index < 3 ? (
                  getRankIcon(index + 1)
                ) : (
                  <span className="text-text-muted font-semibold">
                    #{entry.rank}
                  </span>
                )}
              </div>

              <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {entry.profiles?.full_name?.charAt(0) || 'U'}
              </div>

              <div>
                <div className="font-semibold">
                  {entry.profiles?.full_name || 'Usuario'}
                </div>
                <div className="text-sm text-text-muted">
                  Nivel {entry.level}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-gradient">{entry.total_points}</div>
              <div className="text-xs text-text-muted">puntos</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
