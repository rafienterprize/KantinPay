import type { Metadata } from "next";
import { Fredoka, Balsamiq_Sans } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${fredoka.variable} ${balsamiqSans.variable}`}>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#D6EFFF] selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
