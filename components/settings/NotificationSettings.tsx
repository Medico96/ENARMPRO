'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Bell, MessageCircle, Send } from 'lucide-react';

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    notifications_enabled: true,
    whatsapp_enabled: false,
    telegram_enabled: false,
    whatsapp_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [telegramLink, setTelegramLink] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { data } = await supabase
      .from('profiles')
      .select('notifications_enabled, whatsapp_enabled, telegram_enabled, whatsapp_number')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const updateSettings = async (key: string, value: any) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    await supabase
      .from('profiles')
      .update({ [key]: value })
      .eq('id', session.user.id);

    setSettings({ ...settings, [key]: value });
  };

  const setupTelegram = async () => {
    setLoading(true);

    const response = await fetch('/api/notifications/setup-telegram', {
      method: 'POST',
    });

    const data = await response.json();

    if (data.success) {
      setTelegramLink(data.inviteLink);
      window.open(data.inviteLink, '_blank');
    } else {
      alert(data.error);
    }

    setLoading(false);
  };

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500/15 rounded-xl flex items-center justify-center">
          <Bell className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Notificaciones</h3>
          <p className="text-text-muted text-sm">Configura cómo quieres recibir recordatorios</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notificaciones generales */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Notificaciones Push</div>
            <div className="text-sm text-text-muted">
              Recordatorios en el navegador/app
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications_enabled}
              onChange={(e) =>
                updateSettings('notifications_enabled', e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-bg-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-accent-primary after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* WhatsApp */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-green-400" />
            <div className="font-medium">WhatsApp</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Activar notificaciones</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.whatsapp_enabled}
                  onChange={(e) =>
                    updateSettings('whatsapp_enabled', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-bg-tertiary rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            {settings.whatsapp_enabled && (
              <input
                type="tel"
                placeholder="+52 1234567890"
                value={settings.whatsapp_number}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_number: e.target.value })
                }
                onBlur={() =>
                  updateSettings('whatsapp_number', settings.whatsapp_number)
                }
                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-dim focus:border-accent-primary focus:outline-none transition-colors"
              />
            )}
          </div>
        </div>

        {/* Telegram */}
        <div className="border-t border-border pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Send className="w-5 h-5 text-blue-400" />
            <div className="font-medium">Telegram</div>
          </div>

          <p className="text-sm text-text-muted mb-4">
            Únete al grupo exclusivo de ENARM Pro y recibe notificaciones en tiempo real.
          </p>

          <button
            onClick={setupTelegram}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-500/15 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/25 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generando link...' : 'Unirme al grupo de Telegram'}
          </button>
        </div>
      </div>
    </div>
  );
}
