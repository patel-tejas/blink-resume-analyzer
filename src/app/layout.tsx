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
  icons: {
    icon: "/favicon.png",
  },
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

        {/* Global Floating Author Badge */}
        <div className="fixed bottom-6 right-6 z-999">
          <a
            href="https://github.com/patel-tejas"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-4 py-2 bg-white/80 backdrop-blur-md border border-white/60 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.2)] hover:-translate-y-1 transition-all duration-300 hover:bg-white text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Built by <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">Tejas</span>
            <span className="text-blue-500 scale-100 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300">💙</span>
          </a>
        </div>
      </body>
    </html>
  );
}
