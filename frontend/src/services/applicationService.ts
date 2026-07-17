import api from './api';
import type { Application, DashboardStats } from '../types';

export const applicationService = {
  getAll: async (): Promise<Application[]> => {
    const res = await api.get('/applications');
    return res.data;
  },
  create: async (data: Partial<Application>): Promise<Application> => {
    const res = await api.post('/applications', data);
    return res.data;
  },
  updateStatus: async (id: string, status: string): Promise<Application> => {
    const res = await api.put(`/applications/${id}/status`, { status });
    return res.data;
  },
  update: async (id: string, data: Partial<Application>): Promise<Application> => {
    const res = await api.put(`/applications/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/applications/${id}`);
  },
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/applications/stats');
    return res.data;
  },
};
