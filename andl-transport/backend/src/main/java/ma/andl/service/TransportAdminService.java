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

    // ==================== LIGNES ====================

    public List<Ligne> getAllLignes() {
        return ligneRepository.findAll();
    }

    public Ligne saveLigne(Ligne ligne) {
        return ligneRepository.save(ligne);
    }

    public void deleteLigne(Long id) {
        ligneRepository.deleteById(id);
    }

    // ==================== ARRETS ====================

    public List<Arret> getAllArrets() {
        return arretRepository.findAll();
    }

    public Arret saveArret(Arret arret) {
        return arretRepository.save(arret);
    }

    public void deleteArret(Long id) {
        arretRepository.deleteById(id);
    }

    // ==================== BUS ====================

    public List<Bus> getAllBus() {
        return busRepository.findAll();
    }

    public Bus saveBus(Bus bus) {
        return busRepository.save(bus);
    }

    public void deleteBus(Long id) {
        busRepository.deleteById(id);
    }

    // ==================== TRAJETS ====================

    public List<Trajet> getAllTrajets() {
        return trajetRepository.findAll();
    }

    public Trajet saveTrajet(Trajet trajet) {
        return trajetRepository.save(trajet);
    }

    public Trajet updateTrajet(Long id, Trajet trajetDetails) {
        Trajet trajet = trajetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trajet non trouvé"));

        trajet.setHeureDepart(trajetDetails.getHeureDepart());
        trajet.setHeureArrivee(trajetDetails.getHeureArrivee());
        trajet.setJoursSemaine(trajetDetails.getJoursSemaine());
        trajet.setPlacesDisponibles(trajetDetails.getPlacesDisponibles());

        if (trajetDetails.getLigne() != null) {
            trajet.setLigne(trajetDetails.getLigne());
        }

        return trajetRepository.save(trajet);
    }

    public void deleteTrajet(Long id) {
        trajetRepository.deleteById(id);
    }

    /**
     * Assigner un chauffeur et un bus à un trajet
     */
    @Transactional
    public Trajet assignerChauffeurEtBus(Long trajetId, Long chauffeurId, Long busId) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet non trouvé avec l'ID: " + trajetId));

        if (chauffeurId != null) {
            Chauffeur chauffeur = chauffeurRepository.findById(chauffeurId)
                    .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé avec l'ID: " + chauffeurId));
            trajet.setChauffeur(chauffeur);
        }

        if (busId != null) {
            Bus bus = busRepository.findById(busId)
                    .orElseThrow(() -> new RuntimeException("Bus non trouvé avec l'ID: " + busId));
            trajet.setBus(bus);
        }

        return trajetRepository.save(trajet);
    }

    // ==================== TARIFS ====================

    public List<Tarif> getAllTarifs() {
        return tarifRepository.findAll();
    }

    public Tarif saveTarif(Tarif tarif) {
        return tarifRepository.save(tarif);
    }

    public void deleteTarif(Long id) {
        tarifRepository.deleteById(id);
    }

    // ==================== CHAUFFEURS ====================

    public List<Chauffeur> getAllChauffeurs() {
        return chauffeurRepository.findAll();
    }

    public Chauffeur saveChauffeur(Chauffeur chauffeur) {
        return chauffeurRepository.save(chauffeur);
    }

    public void deleteChauffeur(Long id) {
        chauffeurRepository.deleteById(id);
    }
}