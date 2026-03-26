export const metadata: Metadata = {
  title: "ENARM Pro | Estudia Inteligente, No Memorices",
  description: "Plataforma de preparación ENARM basada en estrategia",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ENARM Pro",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png" },
      { url: "/icon-512x512.png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "ENARM Pro",
    title: "ENARM Pro | Estudia Inteligente, No Memorices",
    description: "La plataforma #1 para aspirantes ENARM",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENARM Pro",
    description: "Plataforma de preparación ENARM con metodología estratégica",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};
