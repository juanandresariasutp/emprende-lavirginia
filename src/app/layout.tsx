import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/layout/header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "Emprende La Virginia",
  title: {
    default: "Emprende La Virginia",
    template: "%s | Emprende La Virginia",
  },
  description:
    "Descubre negocios, emprendimientos, productos y servicios de La Virginia, Risaralda.",
  keywords: [
    "La Virginia",
    "Risaralda",
    "negocios locales",
    "emprendimientos",
    "productos",
    "servicios",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Emprende La Virginia",
    title: "Emprende La Virginia",
    description:
      "Encuentra negocios, productos y servicios locales en un solo lugar.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emprende La Virginia",
    description:
      "Encuentra negocios, productos y servicios locales en un solo lugar.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CO"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido-principal"
          className="bg-background text-foreground focus:ring-ring sr-only z-50 rounded-md px-4 py-2 font-medium focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:ring-2 focus:ring-offset-2 focus:outline-none"
        >
          Ir al contenido principal
        </a>
        <Header />
        <main id="contenido-principal" className="flex flex-1 flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
