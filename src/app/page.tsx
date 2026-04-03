"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FileUpload from "@/components/FileUpload";
import FloatingLogos from "@/components/FloatingLogos";
import ProgressStepper from "@/components/ProgressStepper";
import type { ProgressStep, ParseResponse, GitHubData, AIInsights, ResumeResult } from "@/lib/types";
import { classifyResume } from "@/lib/classifyResume";

const INITIAL_STEPS: ProgressStep[] = [
  { id: "upload", label: "Upload", status: "pending" },
  { id: "parse", label: "Parse PDF", status: "pending" },
  { id: "github", label: "Extracting Links", status: "pending" },
  { id: "ai", label: "AI Analysis", status: "pending" },
  { id: "done", label: "Done", status: "pending" },
];

export default function Home() {
  const router = useRouter();
  const [steps, setSteps] = useState<ProgressStep[]>(INITIAL_STEPS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStep = (id: string, update: Partial<ProgressStep>) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...update } : s))
    );
  };

  const processResume = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);
      setSteps(INITIAL_STEPS);

      let parseData: ParseResponse | null = null;
      let githubData: GitHubData | null = null;
      let insights: AIInsights | null = null;
      let pdfDataUrl: string | null = null;

      try {
        // Convert PDF to base64 data URL for dashboard viewing
        pdfDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Step 1: Upload
        updateStep("upload", { status: "active", detail: "Uploading..." });
        const formData = new FormData();
        formData.append("resume", file);

        const parseRes = await fetch("/api/parse", {
          method: "POST",
          body: formData,
        });

        if (!parseRes.ok) {
          const err = await parseRes.json();
          throw new Error(err.error || "Upload failed");
        }

        parseData = (await parseRes.json()) as ParseResponse;
        updateStep("upload", { status: "done" });

        // Step 2: Parse complete
        updateStep("parse", { status: "active", detail: "Extracting text..." });
        await new Promise((r) => setTimeout(r, 600));
        updateStep("parse", {
          status: "done",
          detail: parseData.githubUsername
            ? `Found: ${parseData.githubUsername}`
            : "No GitHub found",
        });

        // Step 3: Links and GitHub enrichment
        const category = classifyResume(parseData.text);

        updateStep("github", { status: "active", detail: "Scanning links..." });

        if (parseData.githubUsername && category === "technical") {
          try {
            const ghRes = await fetch(
              `/api/enrich/github?username=${encodeURIComponent(parseData.githubUsername)}`
            );
            const ghData = await ghRes.json();

            if (!ghData.error) {
              githubData = ghData as GitHubData;
            }
          } catch {
            // Silently fail GitHub API but still mark the Links step as done
          }
        } else {
          // Artificial delay for UI consistency when no API call is made
          await new Promise((r) => setTimeout(r, 600));
        }

        updateStep("github", {
          status: "done",
          detail: "Links extracted"
        });

        // Step 4: AI Insights
        updateStep("ai", { status: "active", detail: "Analyzing with our AI Models" });

        try {
          const aiRes = await fetch("/api/insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resumeText: parseData.text,
              githubData: githubData,
              leetcodeUsername: parseData.leetcodeUsername,
              codeforcesUsername: parseData.codeforcesUsername,
            }),
          });

          const aiData = await aiRes.json();

          if (aiData.error) {
            updateStep("ai", { status: "error", detail: aiData.message });
          } else {
            insights = aiData as AIInsights;
            updateStep("ai", { status: "done", detail: `Score: ${aiData.score}/100` });
          }
        } catch {
          updateStep("ai", { status: "error", detail: "Analysis failed" });
        }

        // Step 5: Done
        updateStep("done", { status: "done" });

        // Store result and navigate
        const result: ResumeResult = {
          jobId: parseData.jobId,
          parseData,
          githubData,
          insights,
          pdfDataUrl,
          timestamp: Date.now(),
        };

        sessionStorage.setItem(parseData.jobId, JSON.stringify(result));

        await new Promise((r) => setTimeout(r, 800));
        router.push(`/dashboard/${parseData.jobId}`);
      } catch (err) {
        let msg = err instanceof Error ? err.message : "Something went wrong";

        // Handle QuotaExceededError nicely specifically
        if (msg.includes("exceeded the quota") || (err as Error)?.name === 'QuotaExceededError') {
          msg = "The file is too heavy or complex to load in browser memory. This usually happens with portfolios, image-heavy documents, or non-resumes. Please upload a standard text-based PDF resume.";
        }

        setError(msg);
        setIsProcessing(false);

        setSteps((prev) =>
          prev.map((s) => (s.status === "active" ? { ...s, status: "error", detail: msg } : s))
        );
      }
    },
    [router]
  );

  return (
    <main
      className="flex-1 flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url("/hero-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Deep gradient overlay to fade clouds perfectly into background color */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[10%] via-[#f8f9fa]/80 via-[70%] to-[#f8f9fa] to-[100%] pointer-events-none z-0"></div>

      {/* Floating company logo pills in the bottom gradient zone */}
      <FloatingLogos />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-4 flex flex-col items-center">

        {/* Centered Resume Hero Image with Deep Fading */}
        <div className="relative w-full max-w-lg md:max-w-xl flex flex-col items-center -mb-28 md:-mb-40 pt-6">
          <motion.div
            className="w-full relative opacity-60 select-none pointer-events-none"
            initial={{ opacity: 0, y: 60, rotateX: 15, scale: 0.9 }}
            animate={{ opacity: 0.7, y: 0, rotateX: 3, scale: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              perspective: '1200px',
              maskImage: 'linear-gradient(to bottom, black 50%, transparent 95%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 95%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <img
              src="/Tejas Patel Resume img.jpg"
              alt="Resume Preview"
              className="w-full h-auto rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white/40"
            />
          </motion.div>

          {/* Overlapping Hero Text - Positioned at bottom of image with solid gradient behind it */}
          <motion.div
            className="relative bottom-4 md:bottom-12 text-center z-20 w-[120%]  to-transparent pt-4 pb-16 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="text-center inline-block">
              <h1
                className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.05] text-slate-900 tracking-tight font-normal drop-shadow-[0_4px_20px_rgba(255,255,255,1)]"
                style={{ fontFamily: "var(--font-instrument)" }}
              >
                What does your Resume <br />
                <span className="text-blue-600 italic font-normal">actually</span> say about You?
              </h1>

              <p
                className="mt-4 text-lg md:text-xl text-slate-400 font-medium tracking-tight"
                style={{ fontFamily: "var(--font-instrument)" }}
              >
                Analyze your resume for free
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Unified Interaction Zone to prevent layout shifts */}
      <div className="relative z-20 w-full max-w-xl mx-auto flex flex-col items-center justify-start mt-12 min-h-[140px]">
        <AnimatePresence mode="wait">
          {!isProcessing && !error && (
            <motion.div
              key="upload"
              className="w-full max-w-[300px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-full scale-90 origin-top">
                <FileUpload onFileSelect={processResume} isProcessing={isProcessing} />
              </div>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              key="progress"
              className="w-full relative z-10 p-4 bg-blue-50/80 backdrop-blur-md rounded-2xl shadow-lg border border-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <ProgressStepper steps={steps} />
            </motion.div>
          )}

          {error && !isProcessing && (
            <motion.div
              key="error"
              className="w-full max-w-md text-center bg-red-50 text-red-600 px-4 py-3 rounded-lg shadow-sm border border-red-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-medium">
                {error}
              </p>
              <button
                onClick={() => {
                  setError(null);
                  setSteps(INITIAL_STEPS);
                }}
                className="mt-2 text-xs font-semibold text-red-700 underline"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>




    </main>
  );
}
