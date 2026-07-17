import api from './api';
import type { ATSResult } from '../types';

export const atsService = {
  analyze: async (resumeText: string, jobDescription: string): Promise<ATSResult> => {
    const res = await api.post('/ats/analyze', { resumeText, jobDescription });
    const raw = res.data.result;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return raw;
    }
  },
};
