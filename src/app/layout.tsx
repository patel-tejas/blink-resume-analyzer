import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Blink — AI Resume Intelligence",
  description:
    "Upload your resume, get AI-powered insights, skill analysis, and GitHub enrichment in seconds.",
  keywords: ["resume parser", "AI insights", "GitHub", "resume analysis"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-full flex flex-col relative z-10 font-sans">
        {children}
      </body>
    </html>
  );
}
