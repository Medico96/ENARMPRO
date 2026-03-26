import { Monitor, Layers, BookOpen, Target, Gem, FileText } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Monitor,
    title: "Simulador Realista",
    description:
      "Replica exacta del formato ENARM. Casos clínicos con tiempo, retroalimentación inmediata y análisis de rendimiento por especialidad.",
    link: "/simulador",
    iconColor: "text-accent-primary",
    bgColor: "bg-accent-primary/15",
  },
  {
    icon: Layers,
    title: "Flashcards Inteligentes",
    description:
      "Sistema de repetición espaciada adaptado a las áreas donde más fallas. Memoriza lo esencial sin perder tiempo.",
    link: "/material#flashcards",
    iconColor: "text-accent-secondary",
    bgColor: "bg-accent-secondary/15",
  },
  {
    icon: BookOpen,
    title: "Resúmenes GPC",
    description:
      "Guías de Práctica Clínica resumidas y dirigidas. Solo lo que el ENARM pregunta, sin información innecesaria.",
    link: "/material#resumenes",
    iconColor: "text-green-400",
    bgColor: "bg-green-400/15",
  },
  {
    icon: Target,
    title: "Metodología Pivote",
    description:
      "Aprende a identificar las palabras clave que te llevan directo a la respuesta correcta sin leer todo el caso.",
    link: "/metodologia",
    iconColor: "text-yellow-400",
    bgColor: "bg-yellow-400/15",
  },
  {
    icon: Gem,
    title: "Joyas ENARM",
    description:
      "Datos patognomónicos y asociaciones clásicas que aparecen año tras año. Si los conoces, son puntos seguros.",
    link: "/metodologia#joyas",
    iconColor: "text-purple-400",
    bgColor: "bg-purple-400/15",
  },
  {
    icon: FileText,
    title: "Fuentes Oficiales",
    description:
      "Acceso directo a GPC DGMoSS, NOM y PAI 2026 organizados por tema. Las fuentes que realmente importan.",
    link: "/material#fuentes",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-400/15",
  },
];

export default function Features() {
  return (
    <section className="py-20 border-t border-border-light">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-accent-hover text-sm font-semibold mb-4">
            ¿Por qué ENARMPro?
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Herramientas diseñadas por médicos que ya pasaron el ENARM, para médicos que van a pasarlo.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                href={feature.link}
                className="group bg-bg-card border border-border rounded-2xl p-8 hover:border-accent-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-gradient transition-colors">
                  {feature.title}
                </h3>

                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center gap-2 text-accent-hover font-medium text-sm group-hover:gap-3 transition-all">
                  <span>Ver más</span>
                  <svg
                    className="w-4 h-4"
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
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
