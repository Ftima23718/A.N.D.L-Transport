import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Tag, message, Spin } from 'antd';

interface TrajetProgramme {
  id: number;
  ligneNom: string;
  heureDepart: string;
  heureArrivee: string;
  joursSemaine: string;
  busMatricule: string;
  placesDisponibles: number;
}

const ProgrammeRechlatChauffeur: React.FC = () => {
  const [trajets, setTrajets] = useState<TrajetProgramme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgramme();
  }, []);

  const fetchProgramme = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/chauffeur/mon-programme', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrajets(res.data);
    } catch (error) {
      message.error('Erreur chargement programme');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Ligne', dataIndex: 'ligneNom', key: 'ligneNom' },
    { title: 'Départ', dataIndex: 'heureDepart', key: 'heureDepart' },
    { title: 'Arrivée', dataIndex: 'heureArrivee', key: 'heureArrivee' },
    {
      title: 'Jours',
      dataIndex: 'joursSemaine',
      key: 'joursSemaine',
      render: (jours: string) => {
        const joursList = jours.split(',');
        return (
          <>
            {joursList.map(jour => (
              <Tag key={jour} color="blue">{jour}</Tag>
            ))}
          </>
        );
      }
    },
    { title: 'Bus', dataIndex: 'busMatricule', key: 'busMatricule' },
    { title: 'Places disponibles', dataIndex: 'placesDisponibles', key: 'placesDisponibles' }
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <div style={{ padding: 24 }}>
      <h1>📅 Programme des trajets</h1>
      <Card>
        <Table dataSource={trajets} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default ProgrammeRechlatChauffeur;