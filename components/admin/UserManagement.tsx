'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, MoreVertical, Mail, Ban, CheckCircle } from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    
    let query = supabase
      .from('profiles')
      .select('*, user_stats(*)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  };

  const updateUserTier = async (userId: string, newTier: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_tier: newTier })
      .eq('id', userId);

    if (!error) {
      fetchUsers();
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-lg mb-4">Gestión de Usuarios</h3>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar por email o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-tertiary border border-border rounded-lg pl-11 pr-4 py-3 text-text-primary placeholder:text-text-dim focus:border-accent-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-tertiary">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Simuladores
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Promedio
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                  Cargando...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-bg-tertiary transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{user.full_name || 'Sin nombre'}</div>
                      <div className="text-sm text-text-muted">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.subscription_tier === 'elite'
                          ? 'bg-purple-500/15 text-purple-400'
                          : user.subscription_tier === 'pro'
                          ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-gray-500/15 text-gray-400'
                      }`}
                    >
                      {user.subscription_tier?.toUpperCase() || 'FREE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.user_stats?.[0]?.total_simuladores || 0}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.user_stats?.[0]?.promedio_aciertos?.toFixed(1) || 0}%
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {new Date(user.created_at).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-text-muted hover:text-text-primary">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
