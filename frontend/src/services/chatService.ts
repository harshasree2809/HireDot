import api from './api';
import type { ChatMessage } from '../types';

export const chatService = {
  send: async (message: string): Promise<ChatMessage> => {
    const res = await api.post('/chat', { message });
    return res.data;
  },
  getHistory: async (): Promise<ChatMessage[]> => {
    const res = await api.get('/chat/history');
    return res.data;
  },
  clearHistory: async (): Promise<void> => {
    await api.delete('/chat/history');
  },
};
