'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { BarChart, Activity, TrendingUp } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Obtener eventos de los últimos 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .gte('timestamp', thirtyDaysAgo.toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Procesar datos
      const simuladoresStarted = data?.filter(e => e.event_name === 'simulador_started').length || 0;
      const simuladoresCompleted = data?.filter(e => e.event_name === 'simulador_completed').length || 0;
      const flashcardsReviewed = data?.filter(e => e.event_name === 'flashcard_reviewed').length || 0;

      setAnalytics({
        simuladoresStarted,
        simuladoresCompleted,
        flashcardsReviewed,
        completionRate: simuladoresStarted > 0 
          ? ((simuladoresCompleted / simuladoresStarted) * 100).toFixed(1) 
          : 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando analytics...</div>;
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart className="w-5 h-5 text-accent-primary" />
        <h3 className="font-semibold text-lg">Analytics (Últimos 30 días)</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-text-muted text-sm mb-1">Simuladores iniciados</div>
          <div className="text-2xl font-bold text-gradient">
            {analytics?.simuladoresStarted || 0}
          </div>
        </div>

        <div>
          <div className="text-text-muted text-sm mb-1">Simuladores completados</div>
          <div className="text-2xl font-bold text-gradient">
            {analytics?.simuladoresCompleted || 0}
          </div>
        </div>

        <div>
          <div className="text-text-muted text-sm mb-1">Flashcards revisadas</div>
          <div className="text-2xl font-bold text-gradient">
            {analytics?.flashcardsReviewed || 0}
          </div>
        </div>

        <div>
          <div className="text-text-muted text-sm mb-1">Tasa de finalización</div>
          <div className="text-2xl font-bold text-green-400">
            {analytics?.completionRate || 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
