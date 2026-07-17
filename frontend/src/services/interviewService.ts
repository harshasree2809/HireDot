import api from './api';
import type { InterviewQuestion } from '../types';

export const interviewService = {
  generate: async (params: {
    jobTitle: string;
    jobDescription: string;
    difficulty: string;
    questionCount: number;
  }): Promise<InterviewQuestion[]> => {
    const res = await api.post('/interview/generate', params);
    const raw = res.data.result;
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return parsed.questions || [];
    } catch { return []; }
  },
};
