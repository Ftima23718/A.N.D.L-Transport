import api from './api';

interface Inscription {
  id?: number;
  etudiantId?: number;
  etudiantNom?: string;
  etudiantPrenom?: string;
  etudiantEmail?: string;
  etablissementId?: number;
  etablissementNom?: string;
  tarifId?: number;
  typeAbonnement?: string;
  montantAbonnement?: number;
  statut?: string;
  dateInscription?: string;
  dateActivation?: string;
  dateExpiration?: string;
  badgeNumero?: string;
  nombreTransports?: number;
  transportCount?: number;
  description?: string;
}

export const inscriptionService = {
  getAllInscriptions: async () => {
    const response = await api.get('/inscriptions');
    return response.data;
  },

  getInscriptionsPaginated: async (page: number = 0, size: number = 10) => {
    const response = await api.get('/inscriptions/paginated', {
      params: { page, size }
    });
    return response.data;
  },

  getInscriptionById: async (id: number) => {
    const response = await api.get(`/inscriptions/${id}`);
    return response.data;
  },

  getInscriptionsByEtudiant: async (etudiantId: number) => {
    const response = await api.get(`/inscriptions/etudiant/${etudiantId}`);
    return response.data;
  },

  getInscriptionsByStatut: async (statut: string) => {
    const response = await api.get(`/inscriptions/statut/${statut}`);
    return response.data;
  },

  getInscriptionsByEtablissement: async (etablissementId: number) => {
    const response = await api.get(`/inscriptions/etablissement/${etablissementId}`);
    return response.data;
  },

  createInscription: async (inscription: Inscription) => {
    const response = await api.post('/inscriptions', inscription);
    return response.data;
  },

  updateInscription: async (id: number, inscription: Inscription) => {
    const response = await api.put(`/inscriptions/${id}`, inscription);
    return response.data;
  },

  activerInscription: async (id: number) => {
    const response = await api.post(`/inscriptions/${id}/activer`);
    return response.data;
  },

  validerInscription: async (id: number) => {
    const response = await api.post(`/inscriptions/${id}/valider`);
    return response.data;
  },

  rejecterInscription: async (id: number) => {
    const response = await api.post(`/inscriptions/${id}/rejeter`);
    return response.data;
  },

  deleteInscription: async (id: number) => {
    await api.delete(`/inscriptions/${id}`);
  }
};
