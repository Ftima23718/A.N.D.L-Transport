import api from './api';

interface Facture {
  id?: number;
  numero?: string;
  etudiantId?: number;
  etudiantNom?: string;
  etudiantPrenom?: string;
  etudiantEmail?: string;
  inscriptionId?: number;
  tarifId?: number;
  typeAbonnement?: string;
  montant: number;
  statut?: string;
  dateEmission?: string;
  dateEcheance?: string;
  datePaiement?: string;
  description?: string;
  dateCreation?: string;
}

export const factureService = {
  getAllFactures: async () => {
    const response = await api.get('/factures');
    return response.data;
  },

  getFacturesPaginated: async (page: number = 0, size: number = 10) => {
    const response = await api.get('/factures/paginated', {
      params: { page, size }
    });
    return response.data;
  },

  getFactureById: async (id: number) => {
    const response = await api.get(`/factures/${id}`);
    return response.data;
  },

  getFacturesByEtudiant: async (etudiantId: number) => {
    const response = await api.get(`/factures/etudiant/${etudiantId}`);
    return response.data;
  },

  getFacturesByStatut: async (statut: string) => {
    const response = await api.get(`/factures/statut/${statut}`);
    return response.data;
  },

  createFacture: async (facture: Facture) => {
    const response = await api.post('/factures', facture);
    return response.data;
  },

  updateFacture: async (id: number, facture: Facture) => {
    const response = await api.put(`/factures/${id}`, facture);
    return response.data;
  },

  emetFacture: async (id: number) => {
    const response = await api.post(`/factures/${id}/emettre`);
    return response.data;
  },

  payerFacture: async (id: number, montant: number) => {
    const response = await api.post(`/factures/${id}/payer`, null, {
      params: { montant }
    });
    return response.data;
  },

  annulerFacture: async (id: number) => {
    const response = await api.post(`/factures/${id}/annuler`);
    return response.data;
  },

  deleteFacture: async (id: number) => {
    await api.delete(`/factures/${id}`);
  }
};
