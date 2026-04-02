export interface ParseResponse {
  jobId: string;
  text: string;
  githubUrl: string | null;
  githubUsername: string | null;
  linkedinUsername: string | null;
  portfolioLinks: string[] | null;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  stars: number;
  language: string | null;
  url: string;
}

export interface GitHubData {
  username: string;
  avatar: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  topRepos: GitHubRepo[];
  profileUrl: string;
  error?: boolean;
  message?: string;
}

export interface SkillCategory {
  category: string;
  level: number; // 0-100
}

// ── Deep Analysis Types ──

export interface ContactInfo {
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa: string | null;
  isRenowned: boolean;
  highlight: string | null;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  highlights: string[];
  isNotable: boolean;
  notableReason: string | null;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  isImpressive: boolean;
  impressiveReason: string | null;
}

export interface Achievement {
  title: string;
  isExceptional: boolean;
  exceptionalReason: string | null;
}

export interface AIInsights {
  score: number; // 0-100
  skills: string[];
  experienceLevel: string;
  strengths: string[];
  redFlags: string[];
  ceoSummary: string;
  skillCategories: SkillCategory[];

  // Deep analysis fields
  contactInfo?: ContactInfo;
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  achievements?: Achievement[];
  certifications?: string[];
  atsScore?: number;
  atsIssues?: string[];
  formatScore?: number;
  formatIssues?: string[];

  error?: boolean;
  message?: string;
}

export interface ResumeResult {
  jobId: string;
  parseData: ParseResponse;
  githubData: GitHubData | null;
  insights: AIInsights | null;
  pdfDataUrl: string | null;
  timestamp: number;
}

export type StepStatus = 'pending' | 'active' | 'done' | 'error' | 'skipped';

export interface ProgressStep {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
}
