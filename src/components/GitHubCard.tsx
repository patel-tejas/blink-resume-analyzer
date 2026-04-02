"use client";

import { motion } from "framer-motion";
import { ExternalLink, Star, Users, GitFork } from "lucide-react";
import type { GitHubData } from "@/lib/types";

interface GitHubCardProps {
  data: GitHubData;
  delay?: number;
}

export default function GitHubCard({ data, delay = 0 }: GitHubCardProps) {
  if (data.error) {
    return (
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          GitHub data unavailable: {data.message}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.avatar}
          alt={data.username}
          className="w-14 h-14 rounded-full border-2"
          style={{ borderColor: "var(--border-subtle)" }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem" }}>
              {data.username}
            </h3>
            <a
              href={data.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              <ExternalLink size={14} />
            </a>
          </div>
          {data.bio && (
            <p className="text-sm mt-0.5 truncate" style={{ color: "var(--text-secondary)" }}>
              {data.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-5 pb-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-1.5">
          <Users size={14} style={{ color: "var(--text-muted)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {data.followers}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            followers
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <GitFork size={14} style={{ color: "var(--text-muted)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {data.publicRepos}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            repos
          </span>
        </div>
      </div>

      {/* Top repos */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
          Top Repositories
        </p>
        <div className="space-y-2.5">
          {data.topRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {repo.name}
                </p>
                {repo.description && (
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {repo.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 ml-3 shrink-0">
                {repo.language && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "var(--text-secondary)",
                  }}>
                    {repo.language}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <Star size={12} style={{ color: "var(--accent)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {repo.stars}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
