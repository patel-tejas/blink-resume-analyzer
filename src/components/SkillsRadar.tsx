"use client";

import { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { SkillCategory } from "@/lib/types";

interface SkillsRadarProps {
  categories: SkillCategory[];
}

export default function SkillsRadar({ categories }: SkillsRadarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = categories.map((c) => ({
    subject: c.category,
    value: c.level,
    fullMark: 100,
  }));

  if (!mounted) {
    return <div className="w-full h-[280px]" />;
  }

  return (
    <div className="w-full h-[280px] min-w-0">
      <ResponsiveContainer width="100%" height="100%" debounce={100}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: "#8b8d98",
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
            }}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
