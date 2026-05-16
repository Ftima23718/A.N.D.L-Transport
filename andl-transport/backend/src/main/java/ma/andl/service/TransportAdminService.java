package ma.andl.service;

import ma.andl.model.entity.*;
import ma.andl.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransportAdminService {

    private final LigneRepository ligneRepository;
    private final ArretRepository arretRepository;
    private final BusRepository busRepository;
    private final TrajetRepository trajetRepository;
    private final TarifRepository tarifRepository;
    private final ChauffeurRepository chauffeurRepository;

    public TransportAdminService(LigneRepository ligneRepository, 
                                ArretRepository arretRepository,
                                BusRepository busRepository, 
                                TrajetRepository trajetRepository,
                                TarifRepository tarifRepository,
                                ChauffeurRepository chauffeurRepository) {
        this.ligneRepository = ligneRepository;
        this.arretRepository = arretRepository;
        this.busRepository = busRepository;
        this.trajetRepository = trajetRepository;
        this.tarifRepository = tarifRepository;
        this.chauffeurRepository = chauffeurRepository;
    }

    // Lignes
    public List<Ligne> getAllLignes() { return ligneRepository.findAll(); }
    @Transactional public Ligne saveLigne(Ligne ligne) { return ligneRepository.save(ligne); }
    @Transactional public void deleteLigne(Long id) { ligneRepository.deleteById(id); }

    // Arrets
    public List<Arret> getAllArrets() { return arretRepository.findAll(); }
    public List<Arret> getArretsByLigne(Long ligneId) { return arretRepository.findByLigneId(ligneId); }
    @Transactional public Arret saveArret(Arret arret) { return arretRepository.save(arret); }
    @Transactional public void deleteArret(Long id) { arretRepository.deleteById(id); }

    // Bus
    public List<Bus> getAllBus() { return busRepository.findAll(); }
    @Transactional public Bus saveBus(Bus bus) { return busRepository.save(bus); }
    @Transactional public void deleteBus(Long id) { busRepository.deleteById(id); }

    // Trajets
    public List<Trajet> getAllTrajets() { return trajetRepository.findAll(); }
    @Transactional public Trajet saveTrajet(Trajet trajet) { return trajetRepository.save(trajet); }
    @Transactional public void deleteTrajet(Long id) { trajetRepository.deleteById(id); }

    // Tarifs
    public List<Tarif> getAllTarifs() { return tarifRepository.findAll(); }
    @Transactional public Tarif saveTarif(Tarif tarif) { return tarifRepository.save(tarif); }
    @Transactional public void deleteTarif(Long id) { tarifRepository.deleteById(id); }

    // Chauffeurs
    public List<Chauffeur> getAllChauffeurs() { return chauffeurRepository.findAll(); }
    @Transactional public Chauffeur saveChauffeur(Chauffeur chauffeur) { return chauffeurRepository.save(chauffeur); }
    @Transactional public void deleteChauffeur(Long id) { chauffeurRepository.deleteById(id); }
}
