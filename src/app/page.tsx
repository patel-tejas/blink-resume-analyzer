"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FileUpload from "@/components/FileUpload";
import ProgressStepper from "@/components/ProgressStepper";
import type { ProgressStep, ParseResponse, GitHubData, AIInsights, ResumeResult } from "@/lib/types";

const INITIAL_STEPS: ProgressStep[] = [
  { id: "upload", label: "Upload", status: "pending" },
  { id: "parse", label: "Parse PDF", status: "pending" },
  { id: "github", label: "GitHub", status: "pending" },
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

        // Step 3: GitHub enrichment
        if (parseData.githubUsername) {
          updateStep("github", { status: "active", detail: "Fetching profile..." });

          try {
            const ghRes = await fetch(
              `/api/enrich/github?username=${encodeURIComponent(parseData.githubUsername)}`
            );
            const ghData = await ghRes.json();

            if (ghData.error) {
              updateStep("github", { status: "error", detail: ghData.message });
            } else {
              githubData = ghData as GitHubData;
              updateStep("github", {
                status: "done",
                detail: `${ghData.publicRepos} repos`,
              });
            }
          } catch {
            updateStep("github", { status: "error", detail: "API unavailable" });
          }
        } else {
          updateStep("github", { status: "skipped", detail: "No link found" });
        }

        // Step 4: AI Insights
        updateStep("ai", { status: "active", detail: "Analyzing with Gemini..." });

        try {
          const aiRes = await fetch("/api/insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resumeText: parseData.text,
              githubData: githubData,
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
        const msg = err instanceof Error ? err.message : "Something went wrong";
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
        backgroundImage: 'url("/swiss kid day.webp")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Deep gradient overlay to fade clouds perfectly into background color */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[20%] via-[#f8f9fa]/80 via-[50%] to-[#f8f9fa] to-[65%] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center mt-20 md:mt-32">

        <motion.div
          className="text-center mb-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="text-center inline-block drop-shadow-md">
            <h1
              className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.05] text-slate-800 tracking-tight font-normal"
              style={{ fontFamily: "var(--font-instrument)" }}
            >
              What does your resume <br />
              <span className="text-blue-600 italic font-normal">actually</span> say about you?
            </h1>

            <p className="mt-5 text-base md:text-lg text-slate-800 font-medium max-w-lg mx-auto drop-shadow-sm">
              Analyze your resume now for free!
            </p>
          </div>
        </motion.div>

        {/* Invisible container for FileUpload */}
        <motion.div
          className="relative z-10 w-full flex justify-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <FileUpload onFileSelect={processResume} isProcessing={isProcessing} />
        </motion.div>

        {/* Progress stepper */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              className="mt-8 w-full max-w-xl relative z-10 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ProgressStepper steps={steps} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error display */}
        <AnimatePresence>
          {error && !isProcessing && (
            <motion.div
              className="mt-6 max-w-md text-center bg-red-50 text-red-600 px-4 py-3 rounded-lg shadow-sm border border-red-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
