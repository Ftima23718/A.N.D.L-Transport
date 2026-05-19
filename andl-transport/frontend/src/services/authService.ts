import api from './api';

export const authService = {
  login: async (credentials: { email: string; motDePasse: string }) => {
    console.debug('[AuthService] login payload:', credentials);
    const response = await api.post('/auth/login', credentials);
    console.debug('[AuthService] login response:', response.data);
    return response.data;
  },
  
  register: async (data: any) => {
    console.debug('[AuthService] register payload:', data);
    const response = await api.post('/auth/register', data);
    console.debug('[AuthService] register response:', response.data);
    return response.data;
  }
};
