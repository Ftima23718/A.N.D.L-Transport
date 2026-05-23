package ma.andl.service;

import ma.andl.dto.request.BusRequest;
import ma.andl.dto.response.BusResponse;
import ma.andl.model.entity.Bus;
import ma.andl.model.entity.Chauffeur;
import ma.andl.model.entity.Etablissement;
import ma.andl.model.enums.StatutBus;
import ma.andl.repository.BusRepository;
import ma.andl.repository.ChauffeurRepository;
import ma.andl.repository.EtablissementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final EtablissementRepository etablissementRepository;

    public BusService(BusRepository busRepository, 
                     ChauffeurRepository chauffeurRepository,
                     EtablissementRepository etablissementRepository) {
        this.busRepository = busRepository;
        this.chauffeurRepository = chauffeurRepository;
        this.etablissementRepository = etablissementRepository;
    }

    public List<Bus> getAllBus() {
        return busRepository.findAll();
    }

    public List<BusResponse> getAllBusResponse() {
        return busRepository.findAll().stream()
                .map(this::mapToBusResponse)
                .collect(Collectors.toList());
    }

    public Optional<Bus> getBusById(Long id) {
        return busRepository.findById(id);
    }

    public BusResponse getBusResponseById(Long id) {
        return busRepository.findById(id)
                .map(this::mapToBusResponse)
                .orElse(null);
    }

    public List<Bus> getBusByEtablissement(Long etablissementId) {
        return busRepository.findByEtablissementId(etablissementId);
    }

    public List<Bus> getBusByChauffeur(Long chauffeurId) {
        return busRepository.findByChauffeurId(chauffeurId);
    }

    @Transactional
    public Bus createBus(BusRequest request) {
        Bus bus = Bus.builder()
                .matricule(request.getMatricule())
                .nom(request.getNom())
                .modele(request.getModele())
                .capacite(request.getCapacite())
                .statut(StatutBus.valueOf(request.getStatut()))
                .telephoneChauffeur(request.getTelephoneChauffeur())
                .heureDebut(request.getHeureDebut())
                .heureFin(request.getHeureFin())
                .description(request.getDescription())
                .build();

        if (request.getChauffeurId() != null) {
            Chauffeur chauffeur = chauffeurRepository.findById(request.getChauffeurId()).orElse(null);
            bus.setChauffeur(chauffeur);
        }

        if (request.getEtablissementId() != null) {
            Etablissement etablissement = etablissementRepository.findById(request.getEtablissementId()).orElse(null);
            bus.setEtablissement(etablissement);
        }

        return busRepository.save(bus);
    }

    @Transactional
    public Bus updateBus(Long id, BusRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus non trouvé"));

        bus.setMatricule(request.getMatricule());
        bus.setNom(request.getNom());
        bus.setModele(request.getModele());
        bus.setCapacite(request.getCapacite());
        bus.setStatut(StatutBus.valueOf(request.getStatut()));
        bus.setTelephoneChauffeur(request.getTelephoneChauffeur());
        bus.setHeureDebut(request.getHeureDebut());
        bus.setHeureFin(request.getHeureFin());
        bus.setDescription(request.getDescription());

        if (request.getChauffeurId() != null) {
            Chauffeur chauffeur = chauffeurRepository.findById(request.getChauffeurId()).orElse(null);
            bus.setChauffeur(chauffeur);
        }

        if (request.getEtablissementId() != null) {
            Etablissement etablissement = etablissementRepository.findById(request.getEtablissementId()).orElse(null);
            bus.setEtablissement(etablissement);
        }

        return busRepository.save(bus);
    }

    @Transactional
    public void deleteBus(Long id) {
        busRepository.deleteById(id);
    }

    private BusResponse mapToBusResponse(Bus bus) {
        return BusResponse.builder()
                .id(bus.getId())
                .matricule(bus.getMatricule())
                .nom(bus.getNom())
                .modele(bus.getModele())
                .capacite(bus.getCapacite())
                .statut(bus.getStatut().name())
                .chauffeurId(bus.getChauffeur() != null ? bus.getChauffeur().getId() : null)
                .chauffeurNom(bus.getChauffeur() != null ? bus.getChauffeur().getNom() : null)
                .chauffeurPrenom(bus.getChauffeur() != null ? bus.getChauffeur().getPrenom() : null)
                .etablissementId(bus.getEtablissement() != null ? bus.getEtablissement().getId() : null)
                .etablissementNom(bus.getEtablissement() != null ? bus.getEtablissement().getNom() : null)
                .telephoneChauffeur(bus.getTelephoneChauffeur())
                .heureDebut(bus.getHeureDebut())
                .heureFin(bus.getHeureFin())
                .description(bus.getDescription())
                .actif(bus.isActif())
                .build();
    }
}
