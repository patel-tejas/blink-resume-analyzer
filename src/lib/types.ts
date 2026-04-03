export interface ParseResponse {
  jobId: string;
  text: string;
  githubUrl: string | null;
  githubUsername: string | null;
  linkedinUsername: string | null;
  leetcodeUsername?: string | null;
  codeforcesUsername?: string | null;
  mediumUsername?: string | null;
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
  github?: string | null;
  linkedin?: string | null;
  hasCompleteContact?: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  expectedGraduation?: string | null;
  gpa: string | null;
  location?: string | null;
  isRenowned: boolean;
  highlight: string | null;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  techStack?: string[];
  highlights: string[];
  usesActionVerbs?: boolean;
  hasMetrics?: boolean;
  isLatestFirst?: boolean;
  isNotable: boolean;
  notableReason: string | null;
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  hasLink?: boolean;
  hasReadme?: boolean;
  isImpressive: boolean;
  impressiveReason: string | null;
}

export interface Achievement {
  title: string;
  hasStatistic?: boolean;
  statisticQuote?: string | null;
  hasCodingProfile?: boolean;
  isExceptional: boolean;
  exceptionalReason: string | null;
}

export interface ResumeFormat {
  likelyTool: string;
  isLatex: boolean;
  sectionOrder: string[];
  sectionOrderFeedback: string;
}

export interface SectionCompleteness {
  hasTitle: boolean;
  hasEducation: boolean;
  hasExperience: boolean;
  hasProjects: boolean;
  hasSkills: boolean;
  hasAchievements: boolean;
  hasCertifications: boolean;
  missingSections: string[];
}

export interface SocialEnrichment {
  leetcode?: {
    platform: string;
    username: string;
    ranking: number;
    resolved: number;
    acceptance: string;
  } | null;
  codeforces?: {
    platform: string;
    username: string;
    rating: number;
    rank: string;
    maxRating: number;
    maxRank: string;
  } | null;
}

export interface AIInsights {
  score: number; // 0-100
  skills: {
    all: string[];
    hasKeywordDensity: boolean;
    missingCommonSkills: string[];
    note: string;
  };
  experienceLevel: string;
  strengths: string[];
  redFlags: string[];
  ceoSummary: string;
  skillCategories: SkillCategory[];
  
  resumeFormat?: ResumeFormat;
  sectionCompleteness?: SectionCompleteness;
  socialEnrichment?: SocialEnrichment;

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
