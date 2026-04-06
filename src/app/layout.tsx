import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { AppHealth } from "@/components/system/AppHealth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Humix", template: "%s · Humix" },
  description: "Gerencie sua coleção de álbuns.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        
        <Providers>
          <AppHealth />
          {children}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
