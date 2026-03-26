import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createTelegramInviteLink } from '@/lib/messaging/telegram';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    // Solo usuarios Pro y Elite tienen acceso al grupo
    if (!['pro', 'elite'].includes(profile?.subscription_tier)) {
      return NextResponse.json(
        { error: 'Solo disponible para planes Pro y Elite' },
        { status: 403 }
      );
    }

    // Crear link de invitación personalizado
    const groupId = process.env.TELEGRAM_GROUP_ID!;
    const result = await createTelegramInviteLink(groupId);

    if (!result.success) {
      throw new Error(result.error);
    }

    return NextResponse.json({ 
      success: true, 
      inviteLink: result.link 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
