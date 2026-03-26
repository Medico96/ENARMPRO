import { Resend } from 'resend';
import WelcomeEmail from './templates/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, userName: string, tier: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ENARM Pro <onboarding@enarmpro.com>',
      to: email,
      subject: '¡Bienvenido a ENARM Pro! 🎉',
      react: WelcomeEmail({ userName, tier }),
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendSimuladorCompletedEmail(
  email: string,
  userName: string,
  score: number,
  totalQuestions: number
) {
  const percentage = (score / totalQuestions) * 100;

  try {
    const { data, error } = await resend.emails.send({
      from: 'ENARM Pro <simuladores@enarmpro.com>',
      to: email,
      subject: `✅ Simulador completado - ${percentage.toFixed(1)}% de aciertos`,
      html: `
        <h2>¡Felicidades ${userName}!</h2>
        <p>Has completado un simulador con los siguientes resultados:</p>
        <ul>
          <li>Preguntas correctas: ${score}/${totalQuestions}</li>
          <li>Porcentaje: ${percentage.toFixed(1)}%</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard">Ver detalles en tu dashboard</a></p>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendDailyReminderEmail(email: string, userName: string, streak: number) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ENARM Pro <recordatorios@enarmpro.com>',
      to: email,
      subject: `🔥 Mantén tu racha de ${streak} días`,
      html: `
        <h2>¡Hola ${userName}!</h2>
        <p>Llevas ${streak} días consecutivos estudiando. ¡No rompas tu racha hoy!</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard">Continuar estudiando</a></p>
      `,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
