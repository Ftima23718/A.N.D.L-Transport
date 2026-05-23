import api from './api';

interface Tarif {
  id?: number;
  typeAbonnement: string;
  montant: number;
  nombreTrajetParMois?: number;
  etablissementId?: number;
  etablissementNom?: string;
  description?: string;
  actif?: boolean;
  dateCreation?: string;
}

export const tarifService = {
  getAllTarifs: async () => {
    const response = await api.get('/tarifs');
    return response.data;
  },

  getTarifById: async (id: number) => {
    const response = await api.get(`/tarifs/${id}`);
    return response.data;
  },

  getTarifsByEtablissement: async (etablissementId: number) => {
    const response = await api.get(`/tarifs/etablissement/${etablissementId}`);
    return response.data;
  },

  getTarifsByType: async (typeAbonnement: string) => {
    const response = await api.get('/tarifs', {
      params: { typeAbonnement }
    });
    return response.data;
  },

  createTarif: async (tarif: Tarif) => {
    const response = await api.post('/tarifs', tarif);
    return response.data;
  },

  updateTarif: async (id: number, tarif: Tarif) => {
    const response = await api.put(`/tarifs/${id}`, tarif);
    return response.data;
  },

  deleteTarif: async (id: number) => {
    await api.delete(`/tarifs/${id}`);
  }
};
