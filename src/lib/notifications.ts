import { db } from './db';
import { differenceInDays } from 'date-fns';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Bu tarayıcı bildirimleri desteklemiyor');
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

export async function sendNotification(title: string, body: string, icon?: string) {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) {
    return;
  }

  new Notification(title, {
    body,
    icon: icon || '/vite.svg',
    badge: '/vite.svg',
  });
}

export async function checkAndSendDailyReminders() {
  const settings = await db.settings.toCollection().first();
  
  if (!settings?.notificationsEnabled) {
    return;
  }

  const activeProductions = await db.productions
    .where('status')
    .equals('active')
    .toArray();

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Parse notification time (format: "HH:mm")
  const [notifHour, notifMinute] = settings.notificationTime.split(':').map(Number);

  // Check if it's notification time (within 1 minute window)
  if (currentHour === notifHour && currentMinute === notifMinute) {
    for (const production of activeProductions) {
      const daysRemaining = differenceInDays(production.endDate, now);
      const totalDays = differenceInDays(production.endDate, production.startDate);
      const daysPassed = totalDays - daysRemaining;

      if (daysRemaining > 0) {
        // First week: daily reminders
        if (daysPassed <= 7) {
          await sendNotification(
            '🧪 Günlük Hatırlatma',
            `${production.name} - Bugün şişeyi çalkalamayı unutma! Dinlenme süreci ${daysPassed}/${totalDays}.`
          );
        }
        // Second week: every 2 days
        else if (daysPassed % 2 === 0) {
          await sendNotification(
            '🧪 Hatırlatma',
            `${production.name} - Şişeyi çalkalamayı unutma! ${daysRemaining} gün kaldı.`
          );
        }
      } else if (daysRemaining === 0) {
        // Last day reminder
        await sendNotification(
          '🎉 Parfüm Hazır!',
          `${production.name} - Test zamanı! Notlarını girmeyi unutma.`
        );
      }
    }
  }
}

// Set up periodic check (every minute)
export function startNotificationService() {
  // Check immediately
  checkAndSendDailyReminders();
  
  // Then check every minute
  setInterval(checkAndSendDailyReminders, 60000);
}
