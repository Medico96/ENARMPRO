'use client';

import { useState, useEffect } from 'react';
import { offlineSync } from '@/lib/offline/sync';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      setQueueSize(offlineSync.getQueueSize());
    };

    updateOnlineStatus();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Actualizar tamaño de cola cada 5 segundos
    const interval = setInterval(() => {
      setQueueSize(offlineSync.getQueueSize());
    }, 5000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, queueSize };
}
