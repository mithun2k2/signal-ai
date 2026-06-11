export type CaptureType = 'note' | 'slide' | 'contact' | 'url' | 'quote';

export interface Capture {
  id: string;
  type: CaptureType;
  content: string;
  context?: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  currentWork: string;
  biggestChallenge: string;
  canOffer: string;
  conference: string;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  actionItem: string;
  relevanceScore: number;
  category: 'technical' | 'career' | 'business' | 'tool';
}

export interface FollowUp {
  personName: string;
  context: string;
  emailDraft: string;
}

export interface ROIBreakdown {
  insightsCaptured: number;
  connectionsToFollow: number;
  actionItemsGenerated: number;
  estimatedValue: 'Low' | 'Medium' | 'High' | 'Exceptional';
}

export interface SynthesisReport {
  topInsights: Insight[];
  actionItems: string[];
  followUpEmails: FollowUp[];
  linkedInPost: string;
  roiScore: number;
  roiBreakdown: ROIBreakdown;
}