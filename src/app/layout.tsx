import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative z-10">{children}</body>
    </html>
  );
}
