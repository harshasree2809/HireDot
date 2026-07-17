import api from './api';
import type { SkillGapResult } from '../types';
import { parseAIResult } from '../lib/parseAIResult';

export const skillService = {
  analyzeGap: async (jobDescription: string, userSkills: string[]): Promise<SkillGapResult> => {
    const res = await api.post('/skills/gap', { jobDescription, userSkills });
    const parsed = parseAIResult(res.data.result, {
      requireKeys: ['overallGapScore'],
    });
    return parsed as unknown as SkillGapResult;
  },
};
