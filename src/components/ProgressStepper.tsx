"use client";

import { motion } from "framer-motion";
import { Upload, FileSearch, Code2, Brain, CheckCircle2 } from "lucide-react";
import type { ProgressStep as Step } from "@/lib/types";

interface ProgressStepperProps {
  steps: Step[];
}

const STEP_ICONS: Record<string, React.ElementType> = {
  upload: Upload,
  parse: FileSearch,
  github: Code2,
  ai: Brain,
  done: CheckCircle2,
};

const STATUS_STYLES: Record<string, { dot: string; text: string; connector: string }> = {
  pending: {
    dot: "bg-white border-slate-200",
    text: "var(--text-muted)",
    connector: "bg-slate-100", // Visible grey line for pending
  },
  active: {
    dot: "border-[var(--accent)]",
    text: "var(--accent-light)",
    connector: "bg-slate-100", // Still grey until done
  },
  done: {
    dot: "bg-[var(--success-dim)] border-[var(--success)]",
    text: "var(--success)",
    connector: "bg-[var(--success)]",
  },
  error: {
    dot: "bg-[var(--error-dim)] border-[var(--error)]",
    text: "var(--error)",
    connector: "bg-[var(--error)]",
  },
  skipped: {
    dot: "bg-white border-slate-100",
    text: "var(--text-muted)",
    connector: "bg-slate-100",
  },
};

export default function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-start justify-between relative">
        {steps.map((step, i) => {
          const Icon = STEP_ICONS[step.id] || CheckCircle2;
          const styles = STATUS_STYLES[step.status];
          const isLast = i === steps.length - 1;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {!isLast && (
                <div
                  className="absolute top-5 left-1/2 h-[2px] w-full z-0"
                  style={{ background: "var(--border-subtle)" }}
                >
                  <motion.div
                    className={`h-full ${styles.connector}`}
                    initial={{ width: "0%" }}
                    animate={{
                      width: step.status === "done" ? "100%" : "0%",
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              )}

              {/* Step circle */}
              <motion.div
                className={`relative z-20 w-10 h-10 rounded-full border-2 flex items-center justify-center ${styles.dot} ${
                  step.status === "active" ? "pulse-active" : ""
                }`}
                style={{
                  backgroundColor: "#ffffff", // Pure solid white mask
                  boxShadow: step.status === "active" ? "0 0 0 2px var(--accent-dim)" : "none",
                }}
                initial={{ scale: 0.95, opacity: 1 }}
                animate={{ 
                  scale: step.status === "active" ? 1.1 : 1,
                  opacity: 1 
                }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color:
                      step.status === "active"
                        ? "var(--accent)"
                        : step.status === "done"
                        ? "var(--success)"
                        : step.status === "error"
                        ? "var(--error)"
                        : "#cbd5e1", // Slightly darker pending grey
                  }}
                />
              </motion.div>

              {/* Label */}
              <motion.p
                className="mt-2.5 text-xs font-medium text-center"
                style={{ color: styles.text }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.1 }}
              >
                {step.label}
              </motion.p>

              {/* Detail text */}
              {step.detail && (
                <motion.p
                  className="mt-0.5 text-[10px] text-center max-w-[80px]"
                  style={{ color: "var(--text-muted)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {step.detail}
                </motion.p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
