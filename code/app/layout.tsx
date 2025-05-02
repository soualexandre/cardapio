import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Festa do Milhão",
  description: "Cardápio da festa do Milhão - Festival Gastronômico Cristão em Paraíso do Tocantins",
  openGraph: {
    title: "Festa do Milhão",
    description: "Cardápio da festa do Milhão - Festival Gastronômico Cristão em Paraíso do Tocantins",
    url: "https://festadomilhao.vercel.app", 
    siteName: "Festa do Milhão",
    images: [
      {
        url: "https://festadomilhao.vercel.app/milhao.png", 
        width: 1200,
        height: 630,
        alt: "Banner da Festa do Milhão",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}