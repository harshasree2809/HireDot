import api from './api';
import type { MasterProfile } from '../types';

export const profileService = {
  getProfile: async (): Promise<MasterProfile | null> => {
    try {
      const res = await api.get('/profile');
      return res.data;
    } catch { return null; }
  },
  saveProfile: async (profile: MasterProfile): Promise<MasterProfile> => {
    const res = await api.put('/profile', profile);
    return res.data;
  },
};
