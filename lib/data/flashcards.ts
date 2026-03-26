import { Flashcard } from "@/types";

export const FLASHCARDS_DATABASE: Flashcard[] = [
  {
    id: "fc-001",
    specialty: "Cardiología",
    isJewel: true,
    question: "¿Cuál es el hallazgo electrocardiográfico patognomónico del Wolff-Parkinson-White?",
    answerTitle: "Onda Delta",
    answerDesc: "Pre-excitación ventricular que se manifiesta como un empastamiento inicial del QRS, con PR corto (<120ms) y QRS ancho.",
    extra: '<strong>Palabra pivote:</strong> "PR corto + onda delta"<br><strong>Tx:</strong> Ablación de vía accesoria',
  },
  {
    id: "fc-002",
    specialty: "Infectología",
    isJewel: true,
    question: "¿Cuál es el hallazgo histopatológico característico de la Actinomicosis?",
    answerTitle: "Gránulos de azufre",
    answerDesc: "Los gránulos de azufre (sulfur granules) son colonias del microorganismo rodeadas de material proteináceo eosinofílico.",
    extra: '<strong>Palabra pivote:</strong> "gránulos amarillentos/de azufre"<br><strong>Agente:</strong> Actinomyces israelii',
  },
  {
    id: "fc-003",
    specialty: "Dermatología",
    isJewel: true,
    question: "¿Qué patología se asocia al signo de Nikolsky positivo?",
    answerTitle: "Pénfigo Vulgar",
    answerDesc: "El signo de Nikolsky consiste en el desprendimiento de la epidermis al ejercer presión lateral sobre piel aparentemente sana.",
    extra: '<strong>Diferencial:</strong> Penfigoide ampolloso = Nikolsky NEGATIVO<br><strong>Ac:</strong> Anti-desmogleína 3',
  },
  {
    id: "fc-004",
    specialty: "Gastroenterología",
    isJewel: true,
    question: "¿Qué patología neonatal muestra imagen de 'doble burbuja' en radiografía?",
    answerTitle: "Atresia Duodenal",
    answerDesc: "La doble burbuja representa aire en estómago y primera porción del duodeno. Fuertemente asociada a Síndrome de Down (30%).",
    extra: '<strong>Palabra pivote:</strong> "doble burbuja + Down"<br><strong>Tx:</strong> Duodeno-duodenostomía',
  },
  {
    id: "fc-005",
    specialty: "Neurología",
    isJewel: true,
    question: "¿Qué hallazgo en LCR es característico de Esclerosis Múltiple?",
    answerTitle: "Bandas Oligoclonales",
    answerDesc: "Las bandas oligoclonales de IgG en LCR están presentes en >90% de los pacientes con EM. Reflejan síntesis intratecal de inmunoglobulinas.",
    extra: '<strong>Criterios:</strong> McDonald (diseminación en tiempo y espacio)<br><strong>Imagen:</strong> Lesiones periventriculares en "dedos de Dawson"',
  },
  {
    id: "fc-006",
    specialty: "Reumatología",
    isJewel: true,
    question: "¿Qué tipo de cristales se encuentran en la artrocentesis de Gota?",
    answerTitle: "Cristales de urato monosódico",
    answerDesc: "Son cristales en forma de aguja con birrefringencia NEGATIVA bajo luz polarizada. Intracelulares durante ataque agudo.",
    extra: '<strong>Diferencial:</strong> Pseudogota = cristales de pirofosfato de calcio (birrefringencia POSITIVA)<br><strong>Articulación más afectada:</strong> 1ra MTF (podagra)',
  },
  {
    id: "fc-007",
    specialty: "Endocrinología",
    isJewel: true,
    question: "¿Cuál es la tríada clásica de la Enfermedad de Graves?",
    answerTitle: "Bocio + Exoftalmos + Mixedema pretibial",
    answerDesc: "Es la causa más frecuente de hipertiroidismo. Se debe a anticuerpos estimulantes del receptor de TSH (TRAb/TSI).",
    extra: '<strong>Palabra pivote:</strong> "exoftalmos + bocio difuso"<br><strong>Gammagrafía:</strong> Captación difusa aumentada<br><strong>Tx definitivo:</strong> Yodo radioactivo',
  },
  {
    id: "fc-008",
    specialty: "Neumología",
    isJewel: false,
    question: "¿Cuál es el patrón radiológico clásico de la Neumonía por Pneumocystis jirovecii?",
    answerTitle: "Vidrio despulido bilateral",
    answerDesc: "Infiltrados intersticiales bilaterales difusos 'en vidrio despulido'. Típicamente en pacientes con VIH y CD4 <200.",
    extra: '<strong>Tinción dx:</strong> Plata metenamina (Grocott)<br><strong>Tx:</strong> TMP-SMX (21 días) + corticoides si PaO2 <70',
  },
];

export function getFlashcardsBySpecialty(specialty: string): Flashcard[] {
  return FLASHCARDS_DATABASE.filter((fc) => fc.specialty === specialty);
}

export function getJewelFlashcards(): Flashcard[] {
  return FLASHCARDS_DATABASE.filter((fc) => fc.isJewel);
}

export function getRandomFlashcard(): Flashcard {
  const randomIndex = Math.floor(Math.random() * FLASHCARDS_DATABASE.length);
  return FLASHCARDS_DATABASE[randomIndex];
}
