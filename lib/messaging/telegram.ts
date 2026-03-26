import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: false });

export async function sendTelegramMessage(chatId: string, message: string) {
  try {
    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    return { success: true };
  } catch (error: any) {
    console.error('Error sending Telegram message:', error);
    return { success: false, error: error.message };
  }
}

export async function createTelegramInviteLink(groupId: string) {
  try {
    const link = await bot.createChatInviteLink(groupId, {
      member_limit: 1,
      expire_date: Math.floor(Date.now() / 1000) + 3600, // 1 hora
    });

    return { success: true, link: link.invite_link };
  } catch (error: any) {
    console.error('Error creating invite link:', error);
    return { success: false, error: error.message };
  }
}

export const TelegramTemplates = {
  welcome: (userName: string, tier: string) => `
🏥 *¡Bienvenido a ENARM Pro, ${userName}!*

Tu suscripción *${tier.toUpperCase()}* está activa.

🎯 Accede al dashboard:
${process.env.NEXT_PUBLIC_SITE_URL}/dashboard

💎 Únete al grupo exclusivo:
/unirme

¿Dudas? Escribe /ayuda
  `,

  simuladorCompleted: (score: number, percentage: number) => `
✅ *Simulador Completado*

📊 Resultados:
• Aciertos: *${score}*
• Porcentaje: *${percentage.toFixed(1)}%*

Ver detalles: ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard

¡Sigue practicando! 💪
  `,

  dailyReminder: (streak: number) => `
🔥 *Racha de ${streak} días*

¡No la rompas hoy!

👉 Estudiar ahora:
${process.env.NEXT_PUBLIC_SITE_URL}/dashboard
  `,
};
