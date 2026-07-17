import api from './api';
import type { InterviewQuestion } from '../types';
import { parseAIResult } from '../lib/parseAIResult';

export const interviewService = {
  generate: async (params: {
    jobTitle: string;
    jobDescription: string;
    difficulty: string;
    questionCount: number;
  }): Promise<InterviewQuestion[]> => {
    const res = await api.post('/interview/generate', params);
    const raw = res.data.result;

    // Gemini sometimes returns a bare array instead of { questions: [...] }
    if (Array.isArray(raw)) {
      if (raw.length === 0) throw new Error('AI returned no interview questions. Please try again.');
      return raw as InterviewQuestion[];
    }
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed.startsWith('[')) {
        try {
          const arr = JSON.parse(trimmed);
          if (Array.isArray(arr) && arr.length > 0) return arr as InterviewQuestion[];
        } catch {
          // fall through to object parser
        }
      }
    }

    const parsed = parseAIResult(raw);
    const questions = parsed.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('AI returned no interview questions. Please try again.');
    }
    return questions as InterviewQuestion[];
  },
};
