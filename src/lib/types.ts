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

export interface AIInsights {
  score: number; // 0-100
  skills: string[];
  experienceLevel: string;
  strengths: string[];
  redFlags: string[];
  ceoSummary: string;
  skillCategories: SkillCategory[];
  error?: boolean;
  message?: string;
}

export interface ResumeResult {
  jobId: string;
  parseData: ParseResponse;
  githubData: GitHubData | null;
  insights: AIInsights | null;
  timestamp: number;
}

export type StepStatus = 'pending' | 'active' | 'done' | 'error' | 'skipped';

export interface ProgressStep {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
}
