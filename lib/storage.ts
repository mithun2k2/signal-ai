import { Capture, UserProfile, SynthesisReport } from './types';

const KEYS = {
  PROFILE: 'signal_profile',
  CAPTURES: 'signal_captures',
  REPORT: 'signal_report',
};

export const storage = {
  getProfile: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },
  setProfile: (profile: UserProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },
  getCaptures: (): Capture[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.CAPTURES);
    return data ? JSON.parse(data) : [];
  },
  addCapture: (capture: Capture) => {
    const captures = storage.getCaptures();
    captures.unshift(capture);
    localStorage.setItem(KEYS.CAPTURES, JSON.stringify(captures));
  },
  deleteCapture: (id: string) => {
    const captures = storage.getCaptures().filter(c => c.id !== id);
    localStorage.setItem(KEYS.CAPTURES, JSON.stringify(captures));
  },
  getReport: (): SynthesisReport | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.REPORT);
    return data ? JSON.parse(data) : null;
  },
  setReport: (report: SynthesisReport) => {
    localStorage.setItem(KEYS.REPORT, JSON.stringify(report));
  },
  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }
};