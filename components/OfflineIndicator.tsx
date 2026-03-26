'use client';

import { useOffline } from '@/hooks/useOffline';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';

export default function OfflineIndicator() {
  const { isOnline, queueSize } = useOffline();

  if (isOnline && queueSize === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOnline ? (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm">
          <WifiOff className="w-5 h-5 text-yellow-400" />
          <div>
            <div className="font-semibold text-yellow-400 text-sm">
              Modo Offline
            </div>
            <div className="text-yellow-300/70 text-xs">
              Tus cambios se sincronizarán automáticamente
            </div>
          </div>
        </div>
      ) : queueSize > 0 ? (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm">
          <CloudOff className="w-5 h-5 text-blue-400 animate-pulse" />
          <div>
            <div className="font-semibold text-blue-400 text-sm">
              Sincronizando...
            </div>
            <div className="text-blue-300/70 text-xs">
              {queueSize} {queueSize === 1 ? 'acción pendiente' : 'acciones pendientes'}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
