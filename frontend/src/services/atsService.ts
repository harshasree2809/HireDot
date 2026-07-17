import api from './api';
import type { ATSResult } from '../types';

export const atsService = {
  analyze: async (resumeText: string, jobDescription: string): Promise<ATSResult> => {
    const res = await api.post('/ats/analyze', { resumeText, jobDescription });
    const raw = res.data.result;
    if (typeof raw !== 'string') return raw;
    try {
      // Try direct parse first
      return JSON.parse(raw);
    } catch {
      // Strip markdown code fences if present
      const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      const cleaned = match ? match[1].trim() : raw.trim();
      try {
        return JSON.parse(cleaned);
      } catch {
        // Extract JSON object from anywhere in the string
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        throw new Error('Could not parse ATS response');
      }
    }
  },
};
