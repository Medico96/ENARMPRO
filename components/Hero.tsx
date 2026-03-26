"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Play, ArrowRight, Clock } from "lucide-react";
import Countdown from "./Countdown";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(99,102,241,0.12)_0%,transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(6,182,212,0.08)_0%,transparent_50%)]" />

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: Math.random() > 0.5 ? "rgba(99, 102, 241, 0.3)" : "rgba(6, 182, 212, 0.3)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              "--duration": `${Math.random() * 10 + 10}s`,
              "--delay": `${Math.random() * -20}s`,
              "--tx": `${Math.random() * 200 - 100}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-accent-hover text-sm font-semibold mb-8">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>La plataforma #1 para aspirantes ENARM</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            No memorices.
            <br />
            <span className="text-gradient">Domina el ENARM.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Aprende a identificar <strong className="text-text-primary">palabras pivote</strong>, 
            descubre las <strong className="text-text-primary">joyas ENARM</strong> y estudia 
            con estrategia. Aquí no hay paja, solo lo que necesitas para pasar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/simulador"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold text-lg hover:shadow-glow transition-all"
            >
              <Play className="w-5 h-5" />
              <span>Iniciar Simulador</span>
            </Link>
            <Link
              href="/metodologia"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-border hover:bg-white/10 text-text-primary rounded-lg font-semibold text-lg transition-all"
            >
              <span>Conoce el método</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Countdown */}
          <Countdown />
        </div>
      </div>
    </section>
  );
}
