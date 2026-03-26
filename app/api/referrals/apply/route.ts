import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();

    // Verificar que el código existe
    const { data: referralCode, error: codeError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (codeError || !referralCode) {
      return NextResponse.json({ error: 'Código inválido' }, { status: 400 });
    }

    // Verificar que no es el mismo usuario
    if (referralCode.user_id === session.user.id) {
      return NextResponse.json({ error: 'No puedes usar tu propio código' }, { status: 400 });
    }

    // Verificar que no ha usado código antes
    const { data: existing } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', session.user.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Ya usaste un código de referido' }, { status: 400 });
    }

    // Crear referral
    const { error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referralCode.user_id,
        referred_id: session.user.id,
        referral_code: code.toUpperCase(),
      });

    if (referralError) throw referralError;

    // Incrementar contador
    await supabase
      .from('referral_codes')
      .update({ uses: referralCode.uses + 1 })
      .eq('id', referralCode.id);

    // Dar recompensa (7 días de Pro gratis)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await supabase
      .from('profiles')
      .update({
        subscription_tier: 'pro',
        subscription_status: 'active',
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', session.user.id);

    return NextResponse.json({ 
      success: true, 
      message: '¡7 días de Pro gratis activados!' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
