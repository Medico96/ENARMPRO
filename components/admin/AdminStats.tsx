import { Users, DollarSign, TrendingUp, Target } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    activeSubscriptions: number;
    totalRevenue: number;
    conversionRate: number | string;
  };
}

export default function AdminStats({ stats }: AdminStatsProps) {
  const cards = [
    {
      icon: Users,
      label: 'Usuarios Totales',
      value: stats.totalUsers.toLocaleString(),
      color: 'text-blue-400',
      bg: 'bg-blue-400/15',
    },
    {
      icon: Target,
      label: 'Suscripciones Activas',
      value: stats.activeSubscriptions.toLocaleString(),
      color: 'text-green-400',
      bg: 'bg-green-400/15',
    },
    {
      icon: DollarSign,
      label: 'Revenue Total',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/15',
    },
    {
      icon: TrendingUp,
      label: 'Tasa de Conversión',
      value: `${stats.conversionRate}%`,
      color: 'text-purple-400',
      bg: 'bg-purple-400/15',
    },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-bg-card border border-border rounded-2xl p-6"
          >
            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <div className="text-3xl font-display font-bold text-gradient mb-1">
              {card.value}
            </div>
            <div className="text-text-muted text-sm">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
}
