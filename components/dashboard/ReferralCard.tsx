'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Gift, Copy, Check, Users } from 'lucide-react';

export default function ReferralCard() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    // Obtener código
    const { data: codeData } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (codeData) {
      setReferralCode(codeData.code);

      // Obtener referidos
      const { data: referralsData } = await supabase
        .from('referrals')
        .select('*, profiles!referrals_referred_id_fkey(full_name, email)')
        .eq('referrer_id', session.user.id);

      setReferrals(referralsData || []);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = `${window.location.origin}/register?ref=${referralCode}`;

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-500/15 rounded-xl flex items-center justify-center">
          <Gift className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Programa de Referidos</h3>
          <p className="text-text-muted text-sm">Gana 1 mes gratis por cada amigo</p>
        </div>
      </div>

      {/* Código */}
      <div className="bg-bg-tertiary rounded-xl p-4 mb-4">
        <div className="text-text-muted text-sm mb-2">Tu código de referido</div>
        <div className="flex items-center justify-between">
          <div className="font-display font-bold text-2xl text-gradient">
            {referralCode || 'Cargando...'}
          </div>
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-accent-primary/15 text-accent-hover rounded-lg hover:bg-accent-primary/25 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-bg-tertiary rounded-lg p-4">
          <div className="text-text-muted text-sm mb-1">Referidos totales</div>
          <div className="text-2xl font-bold text-gradient">{referrals.length}</div>
        </div>
        <div className="bg-bg-tertiary rounded-lg p-4">
          <div className="text-text-muted text-sm mb-1">Meses ganados</div>
          <div className="text-2xl font-bold text-green-400">{referrals.length}</div>
        </div>
      </div>

      {/* Compartir */}
      <div className="space-y-2">
        <button
          onClick={() => {
            const text = `¡Únete a ENARM Pro con mi código ${referralCode} y obtén 7 días gratis! ${shareUrl}`;
            if (navigator.share) {
              navigator.share({ text });
            } else {
              navigator.clipboard.writeText(text);
              alert('Link copiado al portapapeles');
            }
          }}
          className="w-full py-3 px-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-glow transition-all"
        >
          Compartir código
        </button>
      </div>

      {/* Lista de referidos */}
      {referrals.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Tus referidos ({referrals.length})</span>
          </div>
          <div className="space-y-2">
            {referrals.slice(0, 5).map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <div className="font-medium">
                    {referral.profiles?.full_name || 'Usuario'}
                  </div>
                  <div className="text-text-muted text-xs">
                    {new Date(referral.created_at).toLocaleDateString('es-MX')}
                  </div>
                </div>
                <div className="text-green-400 text-xs font-semibold">
                  +1 mes
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
