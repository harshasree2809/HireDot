export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url: string;
  githubUrl: string;
}

export interface MasterProfile {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
  certifications: string[];
  projects: Project[];
}

export interface ResumeVersion {
  id: string;
  userId: string;
  versionName: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  parsedText: string;
  targetJobTitle: string;
  isTailored: boolean;
  atsScore: number;
  uploadedAt: string;
}

export type ApplicationStatus = 'BOOKMARKED' | 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string;
  location: string;
  salaryRange: string;
  status: ApplicationStatus;
  atsScore: number;
  notes: string;
  resumeVersionId: string;
  appliedAt: string;
  updatedAt: string;
  interviewDate?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ATSResult {
  atsScore: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  suggestions: string[];
  sectionScores: {
    skills: number;
    experience: number;
    education: number;
    formatting: number;
  };
  summary: string;
}

export interface JobMatchResult {
  matchScore: number;
  fitLevel: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  matchedRequirements: string[];
  unmatchedRequirements: string[];
  strengths: string[];
  improvements: string[];
  recommendation: string;
}

export interface SkillGapResult {
  overallGapScore: number;
  presentSkills: string[];
  missingCriticalSkills: {
    skill: string;
    importance: 'HIGH' | 'MEDIUM' | 'LOW';
    learningResources: {
      name: string;
      url: string;
      duration: string;
    }[];
  }[];
  recommendedCourses: string[];
  estimatedTimeToReady: string;
  careerPath: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: 'TECHNICAL' | 'BEHAVIORAL' | 'SITUATIONAL' | 'CULTURE_FIT';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  sampleAnswer: string;
  tips: string[];
}

export interface DashboardStats {
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  rejected: number;
}
