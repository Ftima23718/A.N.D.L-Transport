import api from './api';

interface Etablissement {
  id?: number;
  nom: string;
  adresse?: string;
  ville?: string;
  telephone?: string;
  responsable?: string;
  niveauScolaire?: string;
  latitude?: number;
  longitude?: number;
  nombreEtudiants?: number;
  nombreTransports?: number;
  actif?: boolean;
}

export const etablissementService = {
  getAllEtablissements: async () => {
    const response = await api.get('/etablissements');
    return response.data;
  },

  getEtablissementById: async (id: number) => {
    const response = await api.get(`/etablissements/${id}`);
    return response.data;
  },

  getEtablissementByVille: async (ville: string) => {
    const response = await api.get('/etablissements', {
      params: { ville }
    });
    return response.data;
  },

  getEtablissementByNiveauScolaire: async (niveau: string) => {
    const response = await api.get('/etablissements', {
      params: { niveauScolaire: niveau }
    });
    return response.data;
  },

  createEtablissement: async (etablissement: Etablissement) => {
    const response = await api.post('/etablissements', etablissement);
    return response.data;
  },

  updateEtablissement: async (id: number, etablissement: Etablissement) => {
    const response = await api.put(`/etablissements/${id}`, etablissement);
    return response.data;
  },

  deleteEtablissement: async (id: number) => {
    await api.delete(`/etablissements/${id}`);
  }
};
