import type { Metadata } from "next";
import { Fredoka, Balsamiq_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const balsamiqSans = Balsamiq_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-balsamiq",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KantinPay — School Digital Payment Ecosystem",
  description:
    "Solusi pembayaran digital sekolah yang praktis, cepat, dan terintegrasi melalui website maupun WhatsApp.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fredoka.variable} ${balsamiqSans.variable}`}>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#D6EFFF] selection:text-slate-900">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
