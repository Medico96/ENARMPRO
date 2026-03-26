"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // ENARM 2025 - Ajustar fecha según convocatoria oficial
      const enarmDate = new Date("2025-11-15T08:00:00-06:00");
      const now = new Date();
      const difference = enarmDate.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="inline-flex flex-col gap-4 bg-bg-card border border-border rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
        <Clock className="w-4 h-4" />
        <span>Faltan para el ENARM 2025</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center min-w-[60px]">
          <span className="font-display text-4xl font-bold text-gradient leading-none">
            {String(timeLeft.days).padStart(3, "0")}
          </span>
          <span className="text-xs text-text-muted uppercase tracking-wider mt-1">
            días
          </span>
        </div>

        <span className="font-display text-3xl font-bold text-text-dim animate-pulse">
          :
        </span>

        <div className="flex flex-col items-center min-w-[50px]">
          <span className="font-display text-4xl font-bold text-gradient leading-none">
            {formatNumber(timeLeft.hours)}
          </span>
          <span className="text-xs text-text-muted uppercase tracking-wider mt-1">
            horas
          </span>
        </div>

        <span className="font-display text-3xl font-bold text-text-dim animate-pulse">
          :
        </span>

        <div className="flex flex-col items-center min-w-[50px]">
          <span className="font-display text-4xl font-bold text-gradient leading-none">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className="text-xs text-text-muted uppercase tracking-wider mt-1">
            min
          </span>
        </div>

        <span className="font-display text-3xl font-bold text-text-dim animate-pulse">
          :
        </span>

        <div className="flex flex-col items-center min-w-[50px]">
          <span className="font-display text-4xl font-bold text-gradient leading-none">
            {formatNumber(timeLeft.seconds)}
          </span>
          <span className="text-xs text-text-muted uppercase tracking-wider mt-1">
            seg
          </span>
        </div>
      </div>
    </div>
  );
}
