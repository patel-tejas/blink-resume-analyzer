"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Company {
  name: string;
  logo: string;
  color: string;
}

const COMPANIES: Company[] = [
  { name: "Google", logo: "/logos/google.svg", color: "#4285F4" },
  { name: "Netflix", logo: "/logos/netflix.svg", color: "#E50914" },
  { name: "Meta", logo: "/logos/meta.svg", color: "#0082FB" },
  { name: "Amazon", logo: "/logos/amazon.svg", color: "#FF9900" },
  { name: "Apple", logo: "/logos/apple.svg", color: "#1d1d1f" },
  { name: "Microsoft", logo: "/logos/microsoft.svg", color: "#00A4EF" },
  { name: "JP Morgan", logo: "/logos/jpmorgan.svg", color: "#003A70" },
  { name: "Spotify", logo: "/logos/spotify.svg", color: "#1DB954" },
  { name: "Tesla", logo: "/logos/tesla.svg", color: "#CC0000" },
  { name: "Uber", logo: "/logos/uber.svg", color: "#1a1a1a" },
];

// Positions split into left side (0-25%) and right side (75-100%), center kept clear
const POSITIONS: { x: string; y: string; rotate: number }[] = [
  // Left side — 5 logos
  { x: "2%", y: "12%", rotate: -5 },
  { x: "12%", y: "38%", rotate: 3 },
  { x: "4%", y: "60%", rotate: -3 },
  { x: "18%", y: "18%", rotate: 4 },
  { x: "27%", y: "76%", rotate: -4 },
  // Right side — 5 logos
  { x: "68%", y: "25%", rotate: 4 },
  { x: "88%", y: "42%", rotate: -3 },
  { x: "65%", y: "65%", rotate: 5 },
  { x: "85%", y: "10%", rotate: -5 },
  { x: "80%", y: "78%", rotate: 3 },
];

export default function FloatingLogos() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[40vh] z-5 pointer-events-none overflow-hidden">
      {/* Scattered logo pills */}
      <div className="relative w-full h-full">
        {COMPANIES.map((company, i) => {
          const pos = POSITIONS[i];
          const floatDuration = 5 + (i % 4) * 0.7;
          const floatDelay = i * 0.25;
          const floatY = 6 + (i % 3) * 3;

          return (
            <motion.div
              key={company.name}
              className="absolute pointer-events-auto"
              style={{
                left: pos.x,
                top: pos.y,
              }}
              initial={{ opacity: 0, y: 25, scale: 0.85, rotate: pos.rotate }}
              animate={{
                opacity: [0, 0.85, 0.85],
                y: [25, 0, -floatY, 0],
                scale: 1,
                rotate: pos.rotate,
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.5 + floatDelay },
                y: {
                  duration: floatDuration,
                  delay: 0.5 + floatDelay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
                scale: { duration: 0.6, delay: 0.5 + floatDelay },
              }}
            >
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-lg border cursor-default select-none hover:scale-105 transition-transform duration-300"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  borderColor: "rgba(255,255,255,0.5)",
                  boxShadow: `0 4px 24px ${company.color}12, 0 1px 6px rgba(0,0,0,0.04)`,
                }}
              >
                {/* Colorize the monochrome SVG using CSS filter via an inline SVG trick */}
                <div
                  className="w-[18px] h-[18px] shrink-0"
                  style={{
                    WebkitMaskImage: `url(${company.logo})`,
                    maskImage: `url(${company.logo})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    backgroundColor: company.color,
                  }}
                />
                <span
                  className="text-[11px] font-semibold tracking-tight whitespace-nowrap"
                  style={{
                    color: company.color,
                    fontFamily: "var(--font-instrument)",
                  }}
                >
                  {company.name}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
