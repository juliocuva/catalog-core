import type { Metadata, Viewport } from "next";
import "../globals.css";
import Link from "next/link";

export const viewport: Viewport = {
  themeColor: "#112D42",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Catálogo DTMS",
  description: "Plataforma de Catálogo Digital",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CatalogCore",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
