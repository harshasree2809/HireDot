import api from './api';
import type { SkillGapResult } from '../types';

export const skillService = {
  analyzeGap: async (jobDescription: string, userSkills: string[]): Promise<SkillGapResult> => {
    const res = await api.post('/skills/gap', { jobDescription, userSkills });
    const raw = res.data.result;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch { return raw; }
  },
};
