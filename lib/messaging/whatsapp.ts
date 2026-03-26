// WhatsApp Business API con Twilio
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // whatsapp:+14155238886

const client = twilio(accountSid, authToken);

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await client.messages.create({
      body: message,
      from: whatsappNumber,
      to: `whatsapp:${to}`,
    });

    return { success: true, messageId: response.sid };
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
}

export async function sendWhatsAppTemplate(
  to: string,
  template: 'welcome' | 'simulador_completed' | 'reminder'
) {
  const templates = {
    welcome: `🏥 *¡Bienvenido a ENARM Pro!*\n\nTu cuenta ha sido activada. Comienza tu preparación:\n\n👉 ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard\n\n¿Necesitas ayuda? Responde a este mensaje.`,
    
    simulador_completed: `✅ *Simulador Completado*\n\nRevisa tus resultados en el dashboard:\n👉 ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard\n\n¡Sigue así!`,
    
    reminder: `⏰ *Recordatorio de Estudio*\n\nLlevas {{streak}} días consecutivos estudiando.\n\n¡No rompas tu racha hoy!\n👉 ${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
  };

  return sendWhatsAppMessage(to, templates[template]);
}
