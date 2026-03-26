'use client';

import { useEffect } from 'react';
import { requestNotificationPermission, scheduleStudyReminder } from '@/lib/notifications/push';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Solicitar permiso de notificaciones
    requestNotificationPermission().then(granted => {
      if (granted) {
        scheduleStudyReminder();
      }
    });
  }, []);

  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
