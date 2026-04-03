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
  FileText,
  ChevronDown,
  Download,
  X,
  Eye,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Trophy,
  Award,
  ShieldCheck,
  FileCheck,
  MapPin,
  Mail,
  Phone,
  User,
} from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import SkillsRadar from "@/components/SkillsRadar";
import InsightCard from "@/components/InsightCard";
import GitHubCard from "@/components/GitHubCard";
import {
  GitHubIcon,
  LinkedInIcon,
  LeetCodeIcon,
  CodeforcesIcon,
  getLinkIcon,
} from "@/components/SocialIcons";
import type { ResumeResult, Education, Experience, Project, Achievement, SocialEnrichment } from "@/lib/types";

// ── Additional Social Cards ──

function LeetCodeCard({ data }: { data: NonNullable<NonNullable<SocialEnrichment>['leetcode']> }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255, 161, 22, 0.1)" }}>
            <LeetCodeIcon size={20} color="#FFA116" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{data.username}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>LeetCode Profile</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>Rank #{data.ranking.toLocaleString()}</p>
          <p className="text-[10px]" style={{ color: "#FFA116" }}>Global Ranking</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Solved</p>
          <p className="text-lg font-serif" style={{ color: "var(--text-primary)" }}>{data.resolved}</p>
        </div>
        <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Acceptance</p>
          <p className="text-lg font-serif" style={{ color: "var(--text-primary)" }}>{data.acceptance}%</p>
        </div>
      </div>
    </div>
  );
}

function CodeforcesCard({ data }: { data: NonNullable<NonNullable<SocialEnrichment>['codeforces']> }) {
  const getRankColor = (rank: string) => {
    const r = rank.toLowerCase();
    if (r.includes("grandmaster")) return "#ff0000";
    if (r.includes("master")) return "#ff8c00";
    if (r.includes("candidate")) return "#aa00aa";
    if (r.includes("expert")) return "#0000ff";
    if (r.includes("specialist")) return "#03a89e";
    if (r.includes("pupil")) return "#008000";
    return "#808080";
  };

  const rankColor = getRankColor(data.rank);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(28, 51, 90, 0.05)" }}>
            <CodeforcesIcon size={22} color="#1C335A" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{data.username}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Codeforces Profile</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold" style={{ color: rankColor }}>{data.rank.toUpperCase()}</p>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Current Rank</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Rating</p>
          <p className="text-lg font-serif" style={{ color: rankColor }}>{data.rating}</p>
        </div>
        <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/50">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>Max Rating</p>
          <p className="text-lg font-serif" style={{ color: getRankColor(data.maxRank) }}>{data.maxRating}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showPdfMobile, setShowPdfMobile] = useState(false);
  const [showPdf, setShowPdf] = useState(true);

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
          <h1 className="text-3xl mb-3" style={{ fontFamily: "var(--font-serif)" }}>
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
              color: "var(--accent)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
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
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>Loading results...</span>
        </div>
      </main>
    );
  }

  const { parseData, githubData, insights, pdfDataUrl } = result;

  return (
    <main className="h-screen flex flex-col overflow-hidden relative">
      {/* Background glow */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(37, 99, 235, 0.03) 0%, transparent 70%)",
        }}
      />

      {/* ── Mobile PDF Modal ── */}
      <AnimatePresence>
        {showPdfMobile && pdfDataUrl && (
          <motion.div
            className="fixed inset-0 z-100 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPdfMobile(false)} />
            <motion.div
              className="absolute inset-4 top-12 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700">Resume PDF</span>
                <button onClick={() => setShowPdfMobile(false)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
              <iframe src={pdfDataUrl ? `${pdfDataUrl}#view=FitH` : undefined} className="flex-1 w-full" title="Resume PDF" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Split Panel Body ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Scrollable analysis */}
        <div className="flex-1 overflow-y-auto analysis-scroll-panel">
          <div className={`mx-auto px-6 py-8 ${showPdf && pdfDataUrl ? 'max-w-3xl' : 'max-w-5xl'}`}>
            
            {/* ── Top Action Bar (Sticky) ── */}
            <div className="sticky top-0 z-20 pt-8 pb-4 mb-4 bg-white/80 backdrop-blur-md -mx-6 px-6 border-b border-gray-100 flex items-center justify-between">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <ArrowLeft size={14} />
                New Analysis
              </button>

              <div className="flex items-center gap-2">
                {/* Mobile PDF toggle */}
                {pdfDataUrl && (
                  <button
                    onClick={() => setShowPdfMobile(!showPdfMobile)}
                    className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ background: "var(--accent-dim)" }}
                  >
                    <Eye size={14} style={{ color: "var(--accent)" }} />
                  </button>
                )}

                {/* Desktop PDF toggle (when hidden) */}
                {pdfDataUrl && !showPdf && (
                  <button
                    onClick={() => setShowPdf(true)}
                    className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                    style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                  >
                    <Eye size={13} />
                    Show PDF
                  </button>
                )}

                {(parseData.linkedinUsername || parseData.githubUsername) && (
                  <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />
                )}

                {parseData.linkedinUsername && (
                  <a
                    href={`https://linkedin.com/in/${parseData.linkedinUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:bg-[rgba(10,102,194,0.08)] bg-[rgba(10,102,194,0.03)]"
                    style={{ color: "#0A66C2" }}
                  >
                    <LinkedInIcon size={14} color="#0A66C2" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </a>
                )}
                {parseData.githubUsername && (
                  <a
                    href={`https://github.com/${parseData.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:bg-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.02)]"
                    style={{ color: "#333" }}
                  >
                    <GitHubIcon size={14} color="#333" />
                    <span className="hidden sm:inline">GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {/* ── Contact Info + Score Hero ── */}
            <motion.section
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Contact bar */}
              {insights?.contactInfo && (
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <div className="flex items-center gap-2">
                    <User size={14} style={{ color: "var(--accent)" }} />
                    <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                      {insights.contactInfo.name}
                    </span>
                  </div>
                  {insights.contactInfo.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} style={{ color: "var(--text-muted)" }} />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{insights.contactInfo.email}</span>
                    </div>
                  )}
                  {insights.contactInfo.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} style={{ color: "var(--text-muted)" }} />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{insights.contactInfo.phone}</span>
                    </div>
                  )}
                  {insights.contactInfo.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} style={{ color: "var(--text-muted)" }} />
                      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{insights.contactInfo.location}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Score + Summary row */}
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {insights && !insights.error && (
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <ScoreBadge score={insights.score} size={130} />
                  </div>
                )}
                <div className="flex-1 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl font-normal mb-1" style={{ fontFamily: "var(--font-serif-art)" }}>
                        Resume Verdict
                      </h1>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/5 text-gray-500">
                          {insights?.experienceLevel}
                        </span>
                        {parseData.githubUsername && (
                          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/5 text-gray-500">
                            GitHub Active
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Secondary Metrics or Status */}
                    <div className="flex items-center gap-6 sm:border-l sm:pl-6 border-gray-100">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">ATS Readiness</p>
                        <p className="text-sm font-medium text-gray-700">Excellent compatibility</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-black/1.5 border border-black/3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-20" />
                    <p className="text-sm leading-relaxed text-gray-600 italic">
                      "{insights?.ceoSummary}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            <div className="gradient-line mb-8" />

            {/* ── Education Section ── */}
            {insights?.education && insights.education.length > 0 && (
              <motion.section className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <InsightCard
                  icon={<GraduationCap size={18} style={{ color: "#7c3aed" }} />}
                  title="Education"
                  delay={0.1}
                >
                  <div className="space-y-3">
                    {insights.education.map((edu: Education, i: number) => (
                      <div key={i} className="p-3 rounded-xl transition-colors" style={{ background: edu.isRenowned ? "rgba(124, 58, 237, 0.04)" : "rgba(0,0,0,0.02)", border: edu.isRenowned ? "1px solid rgba(124, 58, 237, 0.12)" : "1px solid var(--border-subtle)" }}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{edu.institution}</p>
                              {edu.isRenowned && (
                                <span className="renowned-badge">
                                  <Sparkles size={10} />
                                  Renowned
                                </span>
                              )}
                            </div>
                            <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{edu.degree}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-sm" style={{ color: "var(--text-muted)" }}>{edu.year}</span>
                              {edu.gpa && <span className="text-sm font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--success-dim)", color: "var(--success)" }}>GPA: {edu.gpa}</span>}
                            </div>
                          </div>
                        </div>
                        {edu.highlight && (
                          <p className="text-sm mt-2 italic" style={{ color: "#7c3aed" }}>✦ {edu.highlight}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </InsightCard>
              </motion.section>
            )}

            {/* ── Experience Section ── */}
            {insights?.experience && insights.experience.length > 0 && (
              <motion.section className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <InsightCard
                  icon={<Briefcase size={18} style={{ color: "#0891b2" }} />}
                  title="Work Experience"
                  delay={0.15}
                >
                  <div className="space-y-3">
                    {insights.experience.map((exp: Experience, i: number) => (
                      <div key={i} className="p-3 rounded-xl" style={{ background: exp.isNotable ? "rgba(8, 145, 178, 0.04)" : "rgba(0,0,0,0.02)", border: exp.isNotable ? "1px solid rgba(8, 145, 178, 0.12)" : "1px solid var(--border-subtle)" }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{exp.role}</p>
                              {exp.isNotable && (
                                <span className="notable-badge">
                                  <Award size={10} />
                                  Notable
                                </span>
                              )}
                            </div>
                            <p className="text-sm" style={{ color: "var(--accent)" }}>{exp.company}</p>
                            <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{exp.duration}</p>
                          </div>
                        </div>
                        {exp.notableReason && (
                          <p className="text-sm mt-2 italic" style={{ color: "#0891b2" }}>✦ {exp.notableReason}</p>
                        )}
                        {exp.highlights.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {exp.highlights.map((h, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: "var(--text-muted)" }} />
                                <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </InsightCard>
              </motion.section>
            )}

            {/* ── Projects Section ── */}
            {insights?.projects && insights.projects.length > 0 && (
              <motion.section className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <InsightCard
                  icon={<FolderKanban size={18} style={{ color: "#ea580c" }} />}
                  title="Projects"
                  delay={0.2}
                >
                  <div className="space-y-3">
                    {insights.projects.map((proj: Project, i: number) => (
                      <div key={i} className="p-3 rounded-xl" style={{ background: proj.isImpressive ? "rgba(234, 88, 12, 0.04)" : "rgba(0,0,0,0.02)", border: proj.isImpressive ? "1px solid rgba(234, 88, 12, 0.12)" : "1px solid var(--border-subtle)" }}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{proj.name}</p>
                          {proj.isImpressive && (
                            <span className="impressive-badge">
                              <Sparkles size={10} />
                              Impressive
                            </span>
                          )}
                          {proj.hasLink && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 font-bold uppercase tracking-tighter">
                              Live / Repo
                            </span>
                          )}
                        </div>
                        <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{proj.description}</p>
                        {proj.impressiveReason && (
                          <p className="text-sm mt-1.5 italic" style={{ color: "#ea580c" }}>✦ {proj.impressiveReason}</p>
                        )}
                        {proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proj.techStack.map((t, j) => (
                              <span key={j} className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(0,0,0,0.05)", color: "var(--text-secondary)" }}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </InsightCard>
              </motion.section>
            )}

            {/* ── Achievements Section ── */}
            {insights?.achievements && insights.achievements.length > 0 && (
              <motion.section className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <InsightCard
                  icon={<Trophy size={18} style={{ color: "#d97706" }} />}
                  title="Achievements"
                  delay={0.25}
                >
                  <div className="space-y-2">
                    {insights.achievements.map((ach: Achievement, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl" style={{ background: ach.isExceptional ? "rgba(217, 119, 6, 0.05)" : "transparent", border: ach.isExceptional ? "1px solid rgba(217, 119, 6, 0.12)" : "1px solid transparent" }}>
                        <div className="shrink-0 mt-0.5">
                          {ach.isExceptional ? (
                            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(217, 119, 6, 0.1)" }}>
                              <Trophy size={12} style={{ color: "#d97706" }} />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(0,0,0,0.04)" }}>
                              <Award size={12} style={{ color: "var(--text-muted)" }} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: "var(--text-primary)" }}>{ach.title}</p>
                          {ach.statisticQuote && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-100">
                                {ach.statisticQuote}
                              </span>
                            </div>
                          )}
                          {ach.exceptionalReason && (
                            <p className="text-sm mt-1.5 italic" style={{ color: "#d97706" }}>✦ {ach.exceptionalReason}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </InsightCard>
              </motion.section>
            )}

            {/* ── Skills Section ── */}
            {insights && !insights.error && (
              <section className={`grid grid-cols-1 ${showPdf && pdfDataUrl ? '' : 'lg:grid-cols-2'} gap-5 mb-8`}>
                <InsightCard icon={<Target size={18} style={{ color: "var(--accent)" }} />} title="Skill Radar" delay={0.3} accent>
                  <SkillsRadar categories={insights.skillCategories} />
                </InsightCard>
                <InsightCard icon={<Sparkles size={18} style={{ color: "var(--accent)" }} />} title="Detected Skills" delay={0.35}>
                  <div className="flex flex-wrap gap-2">
                    {insights.skills.all.map((skill: string) => (<span key={skill} className="tag-pill">{skill}</span>))}
                  </div>
                  {insights.skills.missingCommonSkills.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-orange-50/50 border border-orange-100/50">
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Recommended Additions</p>
                      <div className="flex flex-wrap gap-1.5">
                        {insights.skills.missingCommonSkills.map((ms: string, mi: number) => (
                          <span key={mi} className="text-xs px-2 py-0.5 rounded bg-white text-orange-700 border border-orange-200">
                            + {ms}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] mt-2 text-orange-600/70 italic">{insights.skills.note}</p>
                    </div>
                  )}
                  {/* Certifications inline */}
                  {insights.certifications && insights.certifications.length > 0 && (
                    <div className="mt-4 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                      <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {insights.certifications.map((cert, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{ background: "var(--success-dim)", color: "var(--success)", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
                            <ShieldCheck size={10} />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </InsightCard>
              </section>
            )}

            {/* ── Strengths & Red Flags ── */}
            {insights && !insights.error && (
              <section className={`grid grid-cols-1 ${showPdf && pdfDataUrl ? '' : 'lg:grid-cols-2'} gap-5 mb-8`}>
                <InsightCard icon={<TrendingUp size={18} style={{ color: "var(--success)" }} />} title="Strengths" delay={0.4}>
                  <ul className="space-y-2.5">
                    {insights.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--success)" }} />
                        <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </InsightCard>
                <InsightCard icon={<AlertTriangle size={18} style={{ color: "var(--warning)" }} />} title="Areas to Improve" delay={0.45}>
                  <ul className="space-y-2.5">
                    {insights.redFlags.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "var(--warning)" }} />
                        <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{r}</span>
                      </li>
                    ))}
                  </ul>
                </InsightCard>
              </section>
            )}

            {/* ── ATS & Format Scores ── */}
            {insights && !insights.error && (insights.atsScore !== undefined || insights.formatScore !== undefined) && (
              <motion.section className={`grid grid-cols-1 ${showPdf && pdfDataUrl ? '' : 'lg:grid-cols-2'} gap-5 mb-8`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                {insights.atsScore !== undefined && (
                  <InsightCard icon={<ShieldCheck size={18} style={{ color: "#6366f1" }} />} title="ATS Compatibility" delay={0.5}>
                    <div className="flex items-center gap-4 mb-4">
                      <ScoreBadge score={insights.atsScore} size={90} />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>ATS Ready Score</p>
                        <p className="text-base font-medium" style={{ color: "var(--text-secondary)" }}>
                          {insights.atsScore >= 80 ? "Excellent ATS compatibility" : insights.atsScore >= 60 ? "Good but room for improvement" : "Needs significant improvement"}
                        </p>
                      </div>
                    </div>
                      <ul className="space-y-2">
                        {insights.atsIssues?.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#6366f1" }} />
                            <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{issue}</span>
                          </li>
                        ))}
                      </ul>
                  </InsightCard>
                )}
                {insights.formatScore !== undefined && (
                  <InsightCard icon={<FileCheck size={18} style={{ color: "#0d9488" }} />} title="Format Quality" delay={0.55}>
                    <div className="flex items-center gap-4 mb-4">
                      <ScoreBadge score={insights.formatScore} size={90} />
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Format Score</p>
                        <p className="text-base font-medium" style={{ color: "var(--text-secondary)" }}>
                          {insights.formatScore >= 80 ? "Clean, professional formatting" : insights.formatScore >= 60 ? "Decent formatting with minor issues" : "Formatting needs work"}
                        </p>
                      </div>
                    </div>
                      <ul className="space-y-2">
                        {insights.formatIssues?.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#0d9488" }} />
                            <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{issue}</span>
                          </li>
                        ))}
                      </ul>
                  </InsightCard>
                )}
              </motion.section>
            )}

            {/* ── GitHub Card ── */}
            {githubData && (
              <section className="mb-8">
                <InsightCard icon={<GitHubIcon size={18} color="var(--text-secondary)" />} title="GitHub Profile" delay={0.6}>
                  <GitHubCard data={githubData} />
                </InsightCard>
              </section>
            )}

            {/* ── LeetCode Card ── */}
            {(() => {
              const lc = insights?.socialEnrichment?.leetcode;
              if (!lc) return null;
              return (
                <section className="mb-8">
                  <InsightCard icon={<LeetCodeIcon size={18} color="#FFA116" />} title="LeetCode Forensic" delay={0.62}>
                    <LeetCodeCard data={lc} />
                  </InsightCard>
                </section>
              );
            })()}

            {/* ── Codeforces Card ── */}
            {(() => {
              const cf = insights?.socialEnrichment?.codeforces;
              if (!cf) return null;
              return (
                <section className="mb-8">
                  <InsightCard icon={<CodeforcesIcon size={18} color="#1C335A" />} title="Codeforces Forensic" delay={0.64}>
                    <CodeforcesCard data={cf} />
                  </InsightCard>
                </section>
              );
            })()}

            {/* ── Extracted Links ── */}
            {parseData.portfolioLinks && parseData.portfolioLinks.filter(link => {
              const lower = link.toLowerCase();
              return !lower.includes("github.com") && 
                     !lower.includes("leetcode.com") && 
                     !lower.includes("codeforces.com");
            }).length > 0 && (
              <section className="mb-8">
                <InsightCard icon={<Sparkles size={18} style={{ color: "var(--text-muted)" }} />} title="Extracted Links" delay={0.65}>
                  <div className="flex flex-col gap-2">
                    {parseData.portfolioLinks
                      .filter(link => {
                        const lower = link.toLowerCase();
                        return !lower.includes("github.com") && 
                               !lower.includes("leetcode.com") && 
                               !lower.includes("codeforces.com");
                      })
                      .map((link, idx) => {
                        const { icon, label } = getLinkIcon(link);
                        return (
                          <a key={idx} href={link} target="_blank" rel="noopener noreferrer"
                            className="text-sm font-medium transition-all p-3 rounded-xl flex items-center gap-3"
                            style={{ color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.background = "transparent"; }}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(0,0,0,0.04)" }}>{icon}</div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{label}</p>
                              <p className="text-sm truncate" style={{ color: "var(--accent)" }}>{link}</p>
                            </div>
                          </a>
                        );
                      })}
                  </div>
                </InsightCard>
              </section>
            )}

            {/* ── Raw Data Export ── */}
            <RawDataExportSection result={result} />

            <div className="h-8" />
          </div>
        </div>

        {/* RIGHT: PDF viewer (desktop) */}
        {pdfDataUrl && showPdf && (
          <motion.div
            className="hidden md:flex pdf-viewer-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="pdf-viewer-container">
              <div className="pdf-viewer-header">
                <FileText size={14} style={{ color: "var(--text-muted)" }} />
                <span className="text-xs font-medium flex-1" style={{ color: "var(--text-muted)" }}>Resume PDF</span>
                <button
                  onClick={() => setShowPdf(false)}
                  className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
                  title="Close PDF viewer"
                >
                  <X size={14} className="text-gray-400" />
                </button>
              </div>
              <iframe src={pdfDataUrl ? `${pdfDataUrl}#view=FitH` : undefined} className="pdf-viewer-iframe" title="Resume PDF" />
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

/* ── Raw Data Export Sub-component ── */
function RawDataExportSection({ result }: { result: ResumeResult }) {
  const [show, setShow] = useState(false);
  
  const rawData = {
    extractedText: result.parseData.text,
    links: {
      github: result.parseData.githubUrl,
      linkedin: result.parseData.linkedinUsername,
      leetcode: result.parseData.leetcodeUsername,
      codeforces: result.parseData.codeforcesUsername,
      medium: result.parseData.mediumUsername,
      portfolio: result.parseData.portfolioLinks,
    },
    aiInsights: result.insights,
  };

  const downloadJson = () => {
    const jsonString = JSON.stringify(rawData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume_analysis.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="mb-8">
      <InsightCard icon={<FileText size={18} style={{ color: "var(--text-muted)" }} />} title="Raw Data & Export" delay={0.7}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setShow(!show)} className="flex items-center gap-2 text-sm transition-colors" style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <ChevronDown size={16} className="transition-transform" style={{ transform: show ? "rotate(180deg)" : "rotate(0deg)" }} />
            {show ? "Hide" : "Show"} raw JSON payload
          </button>
          
          <button onClick={downloadJson} className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100">
            <Download size={14} />
            Export JSON
          </button>
        </div>

        <AnimatePresence>
          {show && (
            <motion.pre className="text-[10px] leading-relaxed whitespace-pre-wrap p-4 rounded-xl overflow-auto max-h-96"
              style={{ color: "var(--text-secondary)", background: "rgba(0,0,0,0.02)", border: "1px solid var(--border-subtle)" }}
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            >
              {JSON.stringify(rawData, null, 2)}
            </motion.pre>
          )}
        </AnimatePresence>
      </InsightCard>
    </section>
  );
}
