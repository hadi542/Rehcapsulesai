export type Phase = 'LANDING' | 'ONBOARDING' | 'INTERVIEW' | 'REPORT';

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface OnboardingData {
  founderName?: string;
  teamSize?: string;
  experience?: string;
  education?: string;
  startupName?: string;
  funding?: string;
  description?: string;
  industry?: string;
  traction?: string;
  challenges?: string;
  priorExperience?: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  fullMark: number;
}

export interface VCReport {
  overallScore: number;
  summary: string;
  categoryScores: CategoryScore[];
  scoreDescription: string;
  strengths: string[];
  redFlags: string[];
  actionableChanges: string[];
  fundraisingPotential: string;
  competitors: {
    name: string;
    description: string;
  }[];
  finalVerdict: 'High' | 'Medium' | 'Low';
  nextSteps: string;
}
