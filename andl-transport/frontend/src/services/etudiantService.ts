import api from './api';

interface Etudiant {
  id?: number;
  email: string;
  nom: string;
  prenom: string;
  role?: string;
  dateNaissance?: string;
  telephone?: string;
  adresse?: string;
  numeroMatricule?: string;
  etablissementId?: number;
  etablissementNom?: string;
  niveauScolaire?: string;
  dateInscription?: string;
  actif?: boolean;
  dateCreation?: string;
  motDePasse?: string;
}

export const etudiantService = {
  getAllEtudiants: async () => {
    const response = await api.get('/etudiants');
    return response.data;
  },

  getEtudiantsPaginated: async (page: number = 0, size: number = 10) => {
    const response = await api.get('/etudiants/paginated', {
      params: { page, size }
    });
    return response.data;
  },

  getEtudiantById: async (id: number) => {
    const response = await api.get(`/etudiants/${id}`);
    return response.data;
  },

  getEtudiantByEmail: async (email: string) => {
    const response = await api.get(`/etudiants/email/${email}`);
    return response.data;
  },

  getEtudiantsByEtablissement: async (etablissementId: number) => {
    const response = await api.get(`/etudiants/etablissement/${etablissementId}`);
    return response.data;
  },

  createEtudiant: async (etudiant: Etudiant) => {
    const response = await api.post('/etudiants', etudiant);
    return response.data;
  },

  updateEtudiant: async (id: number, etudiant: Etudiant) => {
    const response = await api.put(`/etudiants/${id}`, etudiant);
    return response.data;
  },

  activateEtudiant: async (id: number) => {
    const response = await api.post(`/etudiants/${id}/activate`);
    return response.data;
  },

  deactivateEtudiant: async (id: number) => {
    const response = await api.post(`/etudiants/${id}/deactivate`);
    return response.data;
  },

  deleteEtudiant: async (id: number) => {
    await api.delete(`/etudiants/${id}`);
  }
};
