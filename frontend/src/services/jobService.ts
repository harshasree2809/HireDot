import api from './api';
import type { JobMatchResult } from '../types';

export const jobService = {
  match: async (resumeText: string, jobDescription: string): Promise<JobMatchResult> => {
    const res = await api.post('/jobs/match', { resumeText, jobDescription });
    const raw = res.data.result;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch { return raw; }
  },
  analyze: async (jobDescription: string) => {
    const res = await api.post('/jobs/analyze', { jobDescription });
    const raw = res.data.result;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch { return raw; }
  },
};
