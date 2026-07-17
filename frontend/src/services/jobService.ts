import api from './api';
import type { JobMatchResult } from '../types';
import { normalizeJobMatch, parseAIResult } from '../lib/parseAIResult';

export const jobService = {
  match: async (resumeText: string, jobDescription: string): Promise<JobMatchResult> => {
    const res = await api.post('/jobs/match', { resumeText, jobDescription });
    const parsed = parseAIResult(res.data.result);
    const normalized = normalizeJobMatch(parsed);
    if (normalized.matchScore === undefined || normalized.matchScore === null) {
      throw new Error('AI returned incomplete job match data. Please try again.');
    }
    return normalized as unknown as JobMatchResult;
  },
  analyze: async (jobDescription: string) => {
    const res = await api.post('/jobs/analyze', { jobDescription });
    return parseAIResult(res.data.result);
  },
};
