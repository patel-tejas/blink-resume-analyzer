"use client";

import { ReactNode } from "react";

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export function GitHubIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function LinkedInIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function TwitterXIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function GlobeIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

export function EmailIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </svg>
  );
}

export function LinkIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function MediumIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M13.54 12a10.8 10.8 0 01-6.77 12A10.8 10.8 0 010 12 10.8 10.8 0 016.77 0 10.8 10.8 0 0113.54 12zM20.96 12a10.8 10.8 0 01-3.23 7.78 10.8 10.8 0 01-3.23-15.56 10.8 10.8 0 013.23 7.78zM24 12a10.8 10.8 0 01-1.22 5.12 10.8 10.8 0 010-10.24 10.8 10.8 0 011.22 5.12z" />
    </svg>
  );
}

export function LeetCodeIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M13.483 0a1.374 1.374 0 00-.961.438L7.116 6.226c-1.283 1.28-1.283 3.363 0 4.643l4.281 4.281h3.393l-5.76-5.763a1.212 1.212 0 010-1.714l5.131-5.133a1.212 1.212 0 011.714 0l1.714 1.715-1.713 1.713c-.067.067-.144.116-.226.155a1.212 1.212 0 01-1.488-.155l-1.714-1.715a.401.401 0 00-.57 0l-5.133 5.133a.401.401 0 000 .57l5.763 5.76a1.212 1.212 0 010 1.714L10.37 24h3.393l5.403-5.403c1.28-1.28 1.28-3.363 0-4.643L13.483 0z" />
    </svg>
  );
}

export function CodeforcesIcon({ size = 18, className = "", color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M4.5 7.5h3v13.5h-3V7.5zM10.5 3h3v18h-3V3zM16.5 10.5h3v10.5h-3V10.5z" />
    </svg>
  );
}

interface LinkIconInfo {
  icon: ReactNode;
  label: string;
  brandColor: string;
}

export function getLinkIcon(url: string, size = 16): LinkIconInfo {
  const lower = url.toLowerCase();

  if (lower.includes("github.com")) {
    return { icon: <GitHubIcon size={size} color="#333" />, label: "GitHub", brandColor: "#333" };
  }
  if (lower.includes("linkedin.com")) {
    return { icon: <LinkedInIcon size={size} color="#0A66C2" />, label: "LinkedIn", brandColor: "#0A66C2" };
  }
  if (lower.includes("leetcode.com")) {
    return { icon: <LeetCodeIcon size={size} color="#FFA116" />, label: "LeetCode", brandColor: "#FFA116" };
  }
  if (lower.includes("codeforces.com")) {
    return { icon: <CodeforcesIcon size={size} color="#1C335A" />, label: "Codeforces", brandColor: "#1C335A" };
  }
  if (lower.includes("medium.com")) {
    return { icon: <MediumIcon size={size} color="#000000" />, label: "Medium", brandColor: "#000000" };
  }
  if (lower.includes("twitter.com") || lower.includes("x.com")) {
    return { icon: <TwitterXIcon size={size} color="#1D1D1F" />, label: "X / Twitter", brandColor: "#1D1D1F" };
  }
  if (lower.includes("mailto:")) {
    return { icon: <EmailIcon size={size} color="#EA4335" />, label: "Email", brandColor: "#EA4335" };
  }

  // Fallback: portfolio / generic website
  return { icon: <GlobeIcon size={size} color="var(--accent)" />, label: "Website", brandColor: "var(--accent)" };
}
