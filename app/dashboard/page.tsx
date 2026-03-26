import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import StudyStreak from '@/components/dashboard/StudyStreak';
import QuickActions from '@/components/dashboard/QuickActions';

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Obtener datos del usuario
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

  const { data: recentSimuladores } = await supabase
    .from('simuladores')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-2">
            ¡Hola, {profile?.full_name || 'Médico'}! 👋
          </h1>
          <p className="text-text-secondary">
            Continúa tu preparación para el ENARM
          </p>
        </div>

        {/* Quick Stats */}
        <DashboardStats stats={stats} />

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <RecentActivity simuladores={recentSimuladores} />
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            <StudyStreak streak={stats?.racha_dias || 0} />
            {/* Aquí puedes agregar más widgets */}
          </div>
        </div>
      </div>
    </div>
  );
}
