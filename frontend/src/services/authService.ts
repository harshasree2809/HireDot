import api from './api';

export interface RegisterData { firstName: string; lastName: string; email: string; password: string; }
export interface LoginData { email: string; password: string; }
export interface AuthResponse { token: string; email: string; firstName: string; lastName: string; userId: string; }

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  login: async (data: LoginData): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
};
