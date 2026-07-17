import api from './api';
import type { ATSResult } from '../types';
import { normalizeAtsResult, parseAIResult } from '../lib/parseAIResult';

export const atsService = {
  analyze: async (resumeText: string, jobDescription: string): Promise<ATSResult> => {
    const res = await api.post('/ats/analyze', { resumeText, jobDescription });
    const parsed = parseAIResult(res.data.result);
    const normalized = normalizeAtsResult(parsed);
    if (normalized.atsScore === undefined || normalized.atsScore === null) {
      throw new Error('AI returned incomplete ATS data. Please try again.');
    }
    return normalized as unknown as ATSResult;
  },
};
