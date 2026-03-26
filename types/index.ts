export interface GPC {
  rank: number;
  title: string;
  code: string;
  specialty: string;
  frequency: "ALTA" | "MEDIA" | "BAJA";
  year: number;
  questions?: number;
  description?: string;
}

export interface Flashcard {
  id: string;
  specialty: string;
  isJewel: boolean;
  question: string;
  answerTitle: string;
  answerDesc: string;
  extra: string;
}

export interface Pregunta {
  id: number;
  caso: string;
  opciones: string[];
  respuestaCorrecta: number;
  especialidad: string;
  explicacion: string;
  palabrasPivote?: string[];
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  popular?: boolean;
  elite?: boolean;
}
