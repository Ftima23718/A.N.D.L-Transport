import api from './api';

interface Administrateur {
  id?: number;
  email: string;
  nom: string;
  prenom: string;
  role?: string;
  actif?: boolean;
  dateCreation?: string;
  motDePasse?: string;
}

export const administrateurService = {
  getAllAdmins: async () => {
    const response = await api.get('/administrateurs');
    return response.data;
  },

  getAdminById: async (id: number) => {
    const response = await api.get(`/administrateurs/${id}`);
    return response.data;
  },

  getAdminByEmail: async (email: string) => {
    const response = await api.get(`/administrateurs/email/${email}`);
    return response.data;
  },

  createAdmin: async (admin: Administrateur) => {
    const response = await api.post('/administrateurs', admin);
    return response.data;
  },

  updateAdmin: async (id: number, admin: Administrateur) => {
    const response = await api.put(`/administrateurs/${id}`, admin);
    return response.data;
  },

  resetPassword: async (id: number, newPassword: string) => {
    const response = await api.post(`/administrateurs/${id}/reset-password`, {
      motDePasse: newPassword
    });
    return response.data;
  },

  changePassword: async (id: number, oldPassword: string, newPassword: string) => {
    const response = await api.post(`/administrateurs/${id}/change-password`, {
      ancienMotDePasse: oldPassword,
      nouveauMotDePasse: newPassword
    });
    return response.data;
  },

  activateAdmin: async (id: number) => {
    const response = await api.post(`/administrateurs/${id}/activate`);
    return response.data;
  },

  deactivateAdmin: async (id: number) => {
    const response = await api.post(`/administrateurs/${id}/deactivate`);
    return response.data;
  },

  deleteAdmin: async (id: number) => {
    await api.delete(`/administrateurs/${id}`);
  }
};
