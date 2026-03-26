const testimonials = [
  {
    rating: 5,
    text: "Reprobé el ENARM dos veces. Con la metodología de palabras pivote entendí que no era cuestión de saber más, sino de saber buscar. Al tercer intento pasé con 72 puntos.",
    author: "Dr. Roberto M.",
    specialty: "Medicina Interna — ENARM 2024",
    avatar: "RM",
  },
  {
    rating: 5,
    text: "Las joyas ENARM son reales. Identifiqué al menos 15 preguntas donde el dato patognomónico me dio la respuesta directa. Eso marca la diferencia.",
    author: "Dra. Ana L.",
    specialty: "Pediatría — ENARM 2024",
    avatar: "AL",
  },
  {
    rating: 5,
    text: "El simulador es lo más parecido al examen real que encontré. La retroalimentación por especialidad me ayudó a enfocar mis últimas semanas de estudio.",
    author: "Dr. Carlos M.",
    specialty: "Cirugía General — ENARM 2024",
    avatar: "CM",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-bg-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-accent-hover text-sm font-semibold mb-4">
            Historias reales
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Ellos ya lo lograron
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-bg-card border border-border rounded-2xl p-8 hover:border-accent-primary/30 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 text-yellow-400 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-text-secondary leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-text-muted text-xs">
                    {testimonial.specialty}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
