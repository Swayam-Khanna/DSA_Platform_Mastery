export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  preferredLanguage: 'cpp' | 'java' | 'python' | 'javascript';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'unassessed';
  coins: number;
  streak: number;
  longestStreak: number;
  totalSolved: number;
  assessmentCompleted: boolean;
  assessmentScore: number;
  avatar: string;
  bio: string;
  github: string;
  linkedin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  companyTags: string[];
  conceptTags: string[];
  starterCode: {
    cpp: string;
    java: string;
    python: string;
    javascript: string;
  };
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  solution?: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    code: string;
  };
  leetcodeLink: string;
  gfgLink: string;
  isPremium: boolean;
  solveCount: number;
  acceptanceRate: number;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
}

export interface RoadmapTopic {
  _id: string;
  topic: string;
  title: string;
  description: string;
  order: number;
  totalProblems: number;
  solvedProblems: number;
  isLocked: boolean;
  resources: { title: string; url: string; type: string }[];
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    _id: string;
    name: string;
    avatar: string;
    skillLevel: string;
  };
  coins: number;
  streak: number;
  totalSolved: number;
}

export interface AssessmentQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, preferredLanguage?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  initialize: () => void;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
}

export interface ProblemFilters {
  topic?: string;
  difficulty?: string;
  company?: string;
  search?: string;
  page?: number;
}

export type Language = 'python' | 'javascript' | 'cpp' | 'java';

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}
