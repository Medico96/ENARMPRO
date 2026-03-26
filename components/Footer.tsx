import Link from "next/link";

const footerLinks = {
  plataforma: [
    { label: "Simulador", href: "/simulador" },
    { label: "Material", href: "/material" },
    { label: "Metodología", href: "/metodologia" },
    { label: "Planes", href: "/planes" },
  ],
  recursos: [
    { label: "Flashcards", href: "/material#flashcards" },
    { label: "Resúmenes GPC", href: "/material#resumenes" },
    { label: "Fuentes oficiales", href: "/material#fuentes" },
    { label: "Joyas ENARM", href: "/metodologia#joyas" },
  ],
  contacto: [
    { label: "contacto@enarmpro.com", href: "mailto:contacto@enarmpro.com" },
    { label: "Instagram", href: "#" },
    { label: "Telegram", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-light bg-bg-secondary/50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  className="w-5 h-5"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold">
                ENARM<span className="text-gradient">Pro</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Plataforma de preparación ENARM basada en estrategia, no en
              memorización.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2">
              {footerLinks.plataforma.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Recursos
            </h4>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-muted mb-4">
              Contacto
            </h4>
            <ul className="space-y-2">
              {footerLinks.contacto.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border-light text-center">
          <p className="text-text-dim text-sm">
            &copy; 2025 ENARMPro. Hecho con 🩺 por médicos, para médicos.
          </p>
        </div>
      </div>
    </footer>
  );
}
