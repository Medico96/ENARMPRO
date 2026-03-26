"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 2847, label: "Preguntas en banco", suffix: "+" },
  { value: 45, label: "Especialidades cubiertas", suffix: "" },
  { value: 180, label: "GPC resumidas", suffix: "+" },
  { value: 94, label: "% tasa de aprobación", suffix: "%" },
];

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 border-y border-border-light bg-bg-secondary/50"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              isVisible={isVisible}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  value,
  label,
  suffix,
  isVisible,
  delay,
}: {
  value: number;
  label: string;
  suffix: string;
  isVisible: boolean;
  delay: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.min(Math.floor(increment * currentStep), value));
      } else {
        clearInterval(timer);
        setCount(value);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div className="text-center" style={{ transitionDelay: `${delay}s` }}>
      <div className="font-display text-4xl md:text-5xl font-extrabold text-gradient mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-text-muted text-sm font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
}
