import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminStats from '@/components/admin/AdminStats';
import UserManagement from '@/components/admin/UserManagement';
import RevenueChart from '@/components/admin/RevenueChart';
import ActivityFeed from '@/components/admin/ActivityFeed';

export default async function AdminPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Verificar si el usuario es admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  // En producción, agregar campo is_admin en profiles
  const isAdmin = session.user.email === 'admin@enarmpro.com'; // Temporal

  if (!isAdmin) {
    redirect('/dashboard');
  }

  // Obtener estadísticas
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: activeSubscriptions } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active');

  const { data: recentPayments } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const totalRevenue = recentPayments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  const stats = {
    totalUsers: totalUsers || 0,
    activeSubscriptions: activeSubscriptions || 0,
    totalRevenue,
    conversionRate: totalUsers ? ((activeSubscriptions || 0) / totalUsers * 100).toFixed(1) : 0,
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-bg-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold mb-2">
            Panel de Administración
          </h1>
          <p className="text-text-secondary">
            Gestión y analytics de la plataforma ENARM Pro
          </p>
        </div>

        {/* Stats Cards */}
        <AdminStats stats={stats} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* User Management - 2 columns */}
          <div className="lg:col-span-2">
            <UserManagement />
          </div>

          {/* Activity Feed - 1 column */}
          <div>
            <ActivityFeed />
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="mt-8">
          <RevenueChart payments={recentPayments || []} />
        </div>
      </div>
    </div>
  );
}
