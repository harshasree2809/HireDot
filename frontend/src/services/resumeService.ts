import api from './api';
import type { ResumeVersion } from '../types';

export const resumeService = {
  upload: async (file: File, versionName?: string): Promise<ResumeVersion> => {
    const formData = new FormData();
    formData.append('file', file);
    if (versionName) formData.append('versionName', versionName);
    const res = await api.post('/resume/upload', formData);
    return res.data;
  },
  getVersions: async (): Promise<ResumeVersion[]> => {
    const res = await api.get('/resume/versions');
    return res.data;
  },
  tailor: async (resumeText: string, jobDescription: string): Promise<string> => {
    const res = await api.post('/resume/tailor', { resumeText, jobDescription });
    return res.data.tailoredResume;
  },
};
