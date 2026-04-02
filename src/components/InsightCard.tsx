"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InsightCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  delay?: number;
  accent?: boolean;
}

export default function InsightCard({
  icon,
  title,
  children,
  delay = 0,
  accent = false,
}: InsightCardProps) {
  return (
    <motion.div
      className={`glass-card p-6 ${accent ? "glow-accent" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: accent ? "var(--accent-dim)" : "rgba(255,255,255,0.05)" }}
        >
          {icon}
        </div>
        <h3
          className="text-base"
          style={{ fontFamily: "var(--font-serif)", color: "var(--text-primary)" }}
        >
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}
