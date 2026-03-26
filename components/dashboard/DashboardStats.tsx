'use client';

import { TrendingUp, Target, Clock, Award } from 'lucide-react';

interface DashboardStatsProps {
  stats: any;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      icon: Target,
      label: 'Simuladores completados',
      value: stats?.total_simuladores || 0,
      color: 'text-accent-primary',
      bg: 'bg-accent-primary/15',
    },
    {
      icon: TrendingUp,
      label: 'Promedio de aciertos',
      value: `${stats?.promedio_aciertos?.toFixed(1) || 0}%`,
      color: 'text-green-400',
      bg: 'bg-green-400/15',
    },
    {
      icon: Clock,
      label: 'Tiempo de estudio',
      value: `${Math.floor((stats?.tiempo_total_estudio || 0) / 60)}h`,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/15',
    },
    {
      icon: Award,
      label: 'Racha actual',
      value: `${stats?.racha_dias || 0} días`,
      color: 'text-purple-400',
      bg: 'bg-purple-400/15',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-bg-card border border-border rounded-2xl p-6 hover:border-accent-primary/30 transition-all"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-display font-bold text-gradient mb-1">
              {stat.value}
            </div>
            <div className="text-text-muted text-sm">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
