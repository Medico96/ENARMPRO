export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      ...options,
    });
  }
}

export function scheduleStudyReminder() {
  // Recordatorio diario a las 9:00 AM
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    9, // 9 AM
    0,
    0
  );

  if (scheduledTime < now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilReminder = scheduledTime.getTime() - now.getTime();

  setTimeout(() => {
    sendLocalNotification('🎯 Hora de estudiar', {
      body: '¡No olvides tu sesión de estudio hoy!',
      tag: 'daily-reminder',
    });

    // Programar para el día siguiente
    scheduleStudyReminder();
  }, timeUntilReminder);
}
