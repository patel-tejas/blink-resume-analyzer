"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreBadgeProps {
  score: number;
  size?: number;
}

export default function ScoreBadge({ score, size = 160 }: ScoreBadgeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (animatedScore / 100) * circumference;
  const offset = circumference - progress;

  const getColor = (s: number) => {
    if (s >= 75) return "var(--success)";
    if (s >= 50) return "var(--accent)";
    if (s >= 30) return "var(--warning)";
    return "var(--error)";
  };

  const getGrade = (s: number) => {
    if (s >= 90) return "A+";
    if (s >= 80) return "A";
    if (s >= 70) return "B+";
    if (s >= 60) return "B";
    if (s >= 50) return "C";
    if (s >= 40) return "D";
    return "F";
  };

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const color = getColor(animatedScore);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={8}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ color, fontFamily: "var(--font-serif)" }}
        >
          {animatedScore}
        </span>
        <span
          className="text-xs font-medium mt-0.5 tracking-wider uppercase"
          style={{ color: "var(--text-muted)" }}
        >
          Grade {getGrade(score)}
        </span>
      </div>
    </div>
  );
}
