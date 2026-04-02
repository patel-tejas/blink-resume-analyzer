"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  FileText,
  ChevronDown,
  Globe,
  Code2,
  Link,
} from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import SkillsRadar from "@/components/SkillsRadar";
import InsightCard from "@/components/InsightCard";
import GitHubCard from "@/components/GitHubCard";
import type { ResumeResult } from "@/lib/types";

export default function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(id);
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        setNotFound(true);
      }
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--accent-dim)" }}
          >
            <FileText size={28} style={{ color: "var(--accent)" }} />
          </div>
          <h1
            className="text-3xl mb-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Session Expired
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
            This analysis result is no longer available. Please upload your resume again.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "var(--accent-dim)",
              color: "var(--accent-light)",
              border: "1px solid rgba(201, 165, 90, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(201, 165, 90, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--accent-dim)";
            }}
          >
            Upload Resume
          </button>
        </motion.div>
      </main>
    );
  }

  if (!result) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "var(--accent)" }}
          />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            Loading results...
          </span>
        </div>
      </main>
    );
  }

  const { parseData, githubData, insights } = result;

  return (
    <main className="min-h-screen relative">
      {/* Background glow */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(201, 165, 90, 0.04) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4" style={{ background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <ArrowLeft size={16} />
            New Analysis
          </button>

          <div className="flex items-center gap-3">
            {parseData.linkedinUsername && (
              <a
                href={`https://linkedin.com/in/${parseData.linkedinUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "rgba(0,0,0,0.05)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.05)")
                }
              >
                <Globe size={14} style={{ color: "var(--text-secondary)" }} />
              </a>
            )}
            {parseData.githubUsername && (
              <a
                href={`https://github.com/${parseData.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: "rgba(0,0,0,0.05)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(0,0,0,0.05)")
                }
              >
                <Code2 size={14} style={{ color: "var(--text-secondary)" }} />
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ── Hero Section: Score + Summary ── */}
        <motion.section
          className="flex flex-col md:flex-row items-center gap-10 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {insights && !insights.error && (
            <div className="shrink-0">
              <ScoreBadge score={insights.score} size={180} />
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            <h1
              className="text-3xl md:text-4xl mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Resume Verdict
            </h1>

            {insights && !insights.error && (
              <>
                <div className="flex flex-wrap items-center gap-3 mb-4 justify-center md:justify-start">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: "var(--accent-dim)",
                      color: "var(--accent-light)",
                      border: "1px solid rgba(201, 165, 90, 0.15)",
                    }}
                  >
                    {insights.experienceLevel}
                  </span>
                  {parseData.githubUsername && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(0,0,0,0.05)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      @{parseData.githubUsername}
                    </span>
                  )}
                  {parseData.linkedinUsername && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(0,0,0,0.05)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      in/{parseData.linkedinUsername}
                    </span>
                  )}
                </div>

                <p
                  className="text-sm leading-relaxed max-w-xl"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {insights.ceoSummary}
                </p>
              </>
            )}

            {(!insights || insights.error) && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                AI insights unavailable. Showing extracted data below.
              </p>
            )}
          </div>
        </motion.section>

        <div className="gradient-line mb-14" />

        {/* ── Skills Section ── */}
        {insights && !insights.error && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <InsightCard
              icon={<Target size={18} style={{ color: "var(--accent)" }} />}
              title="Skill Radar"
              delay={0.1}
              accent
            >
              <SkillsRadar categories={insights.skillCategories} />
            </InsightCard>

            <InsightCard
              icon={<Sparkles size={18} style={{ color: "var(--accent)" }} />}
              title="Detected Skills"
              delay={0.2}
            >
              <div className="flex flex-wrap gap-2">
                {insights.skills.map((skill) => (
                  <span key={skill} className="tag-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </InsightCard>
          </section>
        )}

        {/* ── Strengths & Red Flags ── */}
        {insights && !insights.error && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <InsightCard
              icon={<TrendingUp size={18} style={{ color: "var(--success)" }} />}
              title="Strengths"
              delay={0.3}
            >
              <ul className="space-y-2.5">
                {insights.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: "var(--success)" }}
                    />
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </InsightCard>

            <InsightCard
              icon={<AlertTriangle size={18} style={{ color: "var(--warning)" }} />}
              title="Areas to Improve"
              delay={0.4}
            >
              <ul className="space-y-2.5">
                {insights.redFlags.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: "var(--warning)" }}
                    />
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </InsightCard>
          </section>
        )}

        {/* ── GitHub Card ── */}
        {githubData && (
          <section className="mb-10">
            <InsightCard
              icon={<Code2 size={18} style={{ color: "var(--text-secondary)" }} />}
              title="GitHub Profile"
              delay={0.5}
            >
              <GitHubCard data={githubData} />
            </InsightCard>
          </section>
        )}

        {/* ── Raw Text ── */}
        <section className="mb-20">
          <InsightCard
            icon={<Briefcase size={18} style={{ color: "var(--text-muted)" }} />}
            title="Extracted Text"
            delay={0.6}
          >
            <button
              onClick={() => setShowRawText(!showRawText)}
              className="flex items-center gap-2 text-sm transition-colors mb-3"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              <ChevronDown
                size={16}
                className="transition-transform"
                style={{
                  transform: showRawText ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
              {showRawText ? "Hide" : "Show"} extracted text
            </button>

            <AnimatePresence>
              {showRawText && (
                <motion.pre
                  className="text-xs leading-relaxed whitespace-pre-wrap p-4 rounded-xl overflow-auto max-h-96"
                  style={{
                    color: "var(--text-secondary)",
                    background: "rgba(0,0,0,0.02)",
                    border: "1px solid var(--border-subtle)",
                  }}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {parseData.text}
                </motion.pre>
              )}
            </AnimatePresence>
          </InsightCard>
        </section>

        {/* ── Extracted Links ── */}
        {parseData.portfolioLinks && parseData.portfolioLinks.length > 0 && (
          <section className="mb-20">
            <InsightCard
              icon={<Link size={18} style={{ color: "var(--text-muted)" }} />}
              title="Extracted Links"
              delay={0.7}
            >
              <div className="flex flex-col gap-3">
                {parseData.portfolioLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium transition-colors p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 flex items-center gap-2"
                    style={{ color: "var(--accent)" }}
                  >
                    <Link size={14} className="shrink-0" />
                    <span className="truncate">{link}</span>
                  </a>
                ))}
              </div>
            </InsightCard>
          </section>
        )}
      </div>
    </main>
  );
}
