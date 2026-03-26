'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Mostrar después de 30 segundos o después del primer simulador
      const hasSeenPrompt = localStorage.getItem('pwa-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowPrompt(true), 30000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detectar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App ya instalada');
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA instalada');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-seen', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-seen', 'true');
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50 animate-slide-up">
      <div className="bg-bg-card border border-accent-primary/30 rounded-2xl p-6 shadow-glow">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              Instala ENARM Pro
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Accede más rápido y estudia sin conexión instalando la app en tu dispositivo.
            </p>

            <button
              onClick={handleInstall}
              className="w-full py-3 px-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-glow transition-all"
            >
              Instalar App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
