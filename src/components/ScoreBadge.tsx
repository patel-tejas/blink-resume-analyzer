"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreBadgeProps {
  score: number;
  size?: number;
}

export default function ScoreBadge({ score, size = 180 }: ScoreBadgeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Adjusted offset to start from top and animate length
  const progress = (animatedScore / 100) * circumference;
  const offset = circumference - progress;

  const getHealthColor = (s: number) => {
    if (s >= 85) return { primary: "#10b981", secondary: "#059669", glow: "rgba(16, 185, 129, 0.3)" }; // Super Green
    if (s >= 70) return { primary: "#2563eb", secondary: "#1d4ed8", glow: "rgba(37, 99, 235, 0.3)" }; // Professional Blue
    if (s >= 50) return { primary: "#f59e0b", secondary: "#d97706", glow: "rgba(245, 158, 11, 0.3)" }; // Warning Amber
    return { primary: "#ef4444", secondary: "#b91c1c", glow: "rgba(239, 68, 68, 0.3)" }; // Error Red
  };

  const colors = getHealthColor(score);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // Ease out quartic
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getGradeDesc = (s: number) => {
    if (s >= 90) return "Exceptional";
    if (s >= 80) return "Strong Match";
    if (s >= 70) return "Good Potential";
    if (s >= 60) return "Fair Match";
    if (s >= 50) return "Minimal Match";
    return "Weak Match";
  };

  return (
    <div className="relative inline-flex items-center justify-center p-4">
      {/* Outer shadow/glow container */}
      <div 
        className="absolute inset-0 rounded-full blur-[30px] opacity-20 transition-all duration-1000"
        style={{ background: colors.primary }}
      />
      
      <svg width={size} height={size} className="-rotate-90 drop-shadow-sm">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          
          <filter id="innerGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="out" />
          </filter>
        </defs>

        {/* Track background */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="rgba(0,0,0,0.03)"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
        />

        {/* The Actual Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ 
            filter: `drop-shadow(0 0 6px ${colors.glow})`
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-baseline justify-center"
        >
          <span 
            className="font-normal leading-none"
            style={{ 
              color: "var(--text-primary)",
              fontFamily: "var(--font-serif-art, serif)",
              fontSize: `${size * 0.35}px`
            }}
          >
            {animatedScore}
          </span>
          <span 
            className="font-light opacity-40 ml-0.5 tracking-tight" 
            style={{ 
              fontFamily: "var(--font-sans)",
              fontSize: `${size * 0.12}px`
            }}
          >
            %
          </span>
        </motion.div>
      </div>
    </div>
  );
}
