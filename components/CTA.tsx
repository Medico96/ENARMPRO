import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="relative bg-gradient-to-r from-accent-primary to-accent-secondary rounded-3xl p-12 md:p-16 overflow-hidden">
          {/* Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -right-24"></div>
            <div className="absolute w-72 h-72 bg-white/10 rounded-full -bottom-36 -left-12"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para dejar de estudiar a ciegas?
            </h2>

            <p className="text-white/90 text-lg mb-10">
              Únete a la comunidad de médicos que estudian con estrategia. Tu plaza
              te está esperando.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/planes"
                className="px-8 py-4 bg-white text-accent-primary rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Ver planes
              </Link>
              <Link
                href="/simulador"
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Probar gratis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
