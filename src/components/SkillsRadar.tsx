"use client";

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
  const data = categories.map((c) => ({
    subject: c.category,
    value: c.level,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid
            stroke="rgba(0,0,0,0.06)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: "#8b8d98",
              fontSize: 11,
              fontFamily: "Inter, sans-serif",
            }}
          />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#c9a55a"
            fill="#c9a55a"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
