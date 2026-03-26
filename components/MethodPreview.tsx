import Link from "next/link";
import { Target, Gem, Brain } from "lucide-react";

const methodPoints = [
  {
    icon: Target,
    title: "Palabras Pivote",
    description:
      "Cada caso clínico tiene 2-3 palabras que te llevan directo al diagnóstico. Te enseñamos a encontrarlas en segundos.",
  },
  {
    icon: Gem,
    title: "Joyas ENARM",
    description:
      "Datos patognomónicos que se repiten año tras año. Son puntos casi regalados si los conoces.",
  },
  {
    icon: Brain,
    title: "Estudio Dirigido",
    description:
      "Sin paja. Solo lo que necesitas saber, organizado por frecuencia de aparición en el examen.",
  },
];

export default function MethodPreview() {
  return (
    <section className="py-20 bg-bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-accent-hover text-sm font-semibold mb-6">
              Nuestra Filosofía
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              El ENARM no se pasa memorizando
            </h2>

            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              Cada año miles de médicos reprueban no porque no sepan medicina,
              sino porque no conocen{" "}
              <strong className="text-text-primary">la estructura del examen</strong>.
              El ENARM tiene patrones, y quien los domina tiene una ventaja enorme.
            </p>

            <div className="space-y-6 mb-10">
              {methodPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-accent-hover" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{point.title}</h4>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/metodologia"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg font-semibold hover:shadow-glow transition-all"
            >
              <span>Conocer la metodología completa</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Visual Demo */}
          <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-bg-tertiary px-6 py-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-accent-hover">
                Caso Clínico Demo
              </span>
              <span className="text-xs text-text-muted">Medicina Interna</span>
            </div>

            <div className="p-8 leading-relaxed text-text-secondary">
              <p>
                Paciente <span className="text-text-dim">masculino de 45 años, con antecedentes de</span>{" "}
                <mark className="bg-accent-secondary/20 text-accent-secondary font-semibold px-1 rounded">
                  alcoholismo crónico
                </mark>
                <span className="text-text-dim">, acude por presentar</span>{" "}
                <mark className="bg-accent-secondary/20 text-accent-secondary font-semibold px-1 rounded">
                  dolor abdominal en barra
                </mark>
                <span className="text-text-dim">, de inicio súbito, acompañado de</span>{" "}
                <mark className="bg-accent-secondary/20 text-accent-secondary font-semibold px-1 rounded">
                  náuseas y vómitos
                </mark>
                <span className="text-text-dim">. A la exploración física se encuentra</span>{" "}
                <mark className="bg-accent-secondary/20 text-accent-secondary font-semibold px-1 rounded">
                  signo de Cullen positivo
                </mark>
                <span className="text-text-dim">. Laboratorios con</span>{" "}
                <mark className="bg-accent-secondary/20 text-accent-secondary font-semibold px-1 rounded">
                  amilasa 1,200 U/L
                </mark>
                <span className="text-text-dim">.</span>
              </p>
            </div>

            <div className="px-8 py-4 border-t border-border bg-bg-tertiary/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="w-2 h-2 bg-accent-secondary rounded-sm"></span>
                <span>= Palabra pivote identificada</span>
              </div>
              <div className="text-sm">
                <span className="text-text-muted">→ Dx:</span>{" "}
                <span className="text-green-400 font-semibold">
                  Pancreatitis aguda necrotizante
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
