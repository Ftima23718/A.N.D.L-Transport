import api from './api';

interface Bus {
  id?: number;
  matricule: string;
  nom: string;
  modele?: string;
  capacite: number;
  statut: string;
  chauffeurId?: number;
  chauffeurNom?: string;
  chauffeurPrenom?: string;
  etablissementId?: number;
  etablissementNom?: string;
  telephoneChauffeur?: string;
  heureDebut?: string;
  heureFin?: string;
  description?: string;
  actif?: boolean;
}

export const busService = {
  getAllBus: async () => {
    const response = await api.get('/bus');
    return response.data;
  },

  getBusById: async (id: number) => {
    const response = await api.get(`/bus/${id}`);
    return response.data;
  },

  getBusByEtablissement: async (etablissementId: number) => {
    const response = await api.get(`/bus/etablissement/${etablissementId}`);
    return response.data;
  },

  createBus: async (bus: Bus) => {
    const response = await api.post('/bus', bus);
    return response.data;
  },

  updateBus: async (id: number, bus: Bus) => {
    const response = await api.put(`/bus/${id}`, bus);
    return response.data;
  },

  deleteBus: async (id: number) => {
    await api.delete(`/bus/${id}`);
  }
};
