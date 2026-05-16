import api from './api';

export const authService = {
  login: async (credentials: { email: string; motDePasse: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  }
};
