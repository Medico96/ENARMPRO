import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  tier: string;
}

export default function WelcomeEmail({ userName, tier }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido a ENARM Pro! Tu preparación comienza ahora.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>🏥 ENARM Pro</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>¡Hola {userName}! 👋</Heading>

            <Text style={text}>
              Bienvenido a <strong>ENARM Pro</strong> - Plan {tier.toUpperCase()}
            </Text>

            <Text style={text}>
              Tu suscripción está activa y tienes acceso completo a:
            </Text>

            <ul style={list}>
              <li>✅ Simuladores ilimitados</li>
              <li>✅ +2,800 preguntas actualizadas</li>
              <li>✅ Flashcards inteligentes</li>
              <li>✅ Resúmenes GPC DGMoSS 2026</li>
              <li>✅ Metodología de palabras pivote</li>
              {tier === 'elite' && (
                <>
                  <li>✅ Asesoría personalizada 1-a-1</li>
                  <li>✅ Grupo exclusivo de Telegram</li>
                  <li>✅ Plan de estudio personalizado</li>
                </>
              )}
            </ul>

            <Section style={buttonContainer}>
              <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`} style={button}>
                Ir al Dashboard
              </Link>
            </Section>

            <Text style={text}>
              ¿Tienes dudas? Responde a este email y te ayudaremos.
            </Text>

            <Text style={footer}>
              <strong>ENARM Pro</strong> - Estudia inteligente, no memorices.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#0a0a0f',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const header = {
  textAlign: 'center' as const,
  padding: '32px 0',
};

const h1 = {
  color: '#f1f1f4',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0',
};

const h2 = {
  color: '#f1f1f4',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const content = {
  backgroundColor: '#15151f',
  borderRadius: '16px',
  padding: '32px',
  border: '1px solid #2a2a3a',
};

const text = {
  color: '#a0a0b4',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const list = {
  color: '#a0a0b4',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '16px 0',
  paddingLeft: '20px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const footer = {
  color: '#6b6b80',
  fontSize: '14px',
  lineHeight: '24px',
  marginTop: '32px',
  textAlign: 'center' as const,
};
