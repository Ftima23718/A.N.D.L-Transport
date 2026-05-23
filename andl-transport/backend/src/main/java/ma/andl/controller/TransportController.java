package ma.andl.controller;

import ma.andl.dto.response.*;
import ma.andl.model.entity.*;
import ma.andl.service.TransportAdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transport")
public class TransportController {

    private final TransportAdminService transportService;

    public TransportController(TransportAdminService transportService) {
        this.transportService = transportService;
    }

    // ==================== LIGNES ====================

    @GetMapping("/lignes")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<List<LigneResponse>> getAllLignes() {
        return ResponseEntity.ok(transportService.getAllLignes().stream()
                .map(this::mapToLigneResponse).collect(Collectors.toList()));
    }

    @PostMapping("/lignes")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Ligne> saveLigne(@RequestBody Ligne ligne) {
        return ResponseEntity.ok(transportService.saveLigne(ligne));
    }

    @DeleteMapping("/lignes/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Void> deleteLigne(@PathVariable Long id) {
        transportService.deleteLigne(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== ARRETS ====================

    @GetMapping("/arrets")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<List<ArretResponse>> getAllArrets() {
        return ResponseEntity.ok(transportService.getAllArrets().stream()
                .map(this::mapToArretResponse).collect(Collectors.toList()));
    }

    @PostMapping("/arrets")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Arret> saveArret(@RequestBody Arret arret) {
        return ResponseEntity.ok(transportService.saveArret(arret));
    }

    @DeleteMapping("/arrets/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Void> deleteArret(@PathVariable Long id) {
        transportService.deleteArret(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== BUS ====================

    @GetMapping("/bus")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<List<BusResponse>> getAllBus() {
        return ResponseEntity.ok(transportService.getAllBus().stream()
                .map(this::mapToBusResponse).collect(Collectors.toList()));
    }

    @PostMapping("/bus")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Bus> saveBus(@RequestBody Bus bus) {
        return ResponseEntity.ok(transportService.saveBus(bus));
    }

    @DeleteMapping("/bus/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        transportService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== TRAJETS ====================

    @GetMapping("/trajets")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<List<TrajetResponse>> getAllTrajets() {
        return ResponseEntity.ok(transportService.getAllTrajets().stream()
                .map(this::mapToTrajetResponse).collect(Collectors.toList()));
    }

    @PostMapping("/trajets")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Trajet> saveTrajet(@RequestBody Trajet trajet) {
        return ResponseEntity.ok(transportService.saveTrajet(trajet));
    }

    @PutMapping("/trajets/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Trajet> updateTrajet(@PathVariable Long id, @RequestBody Trajet trajet) {
        try {
            Trajet updated = transportService.updateTrajet(id, trajet);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/trajets/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Void> deleteTrajet(@PathVariable Long id) {
        transportService.deleteTrajet(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /api/transport/trajets/{id}/assigner
     * Assigner un chauffeur et un bus à un trajet
     */
    @PutMapping("/trajets/{id}/assigner")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Trajet> assignerChauffeurEtBus(
            @PathVariable Long id,
            @RequestBody AssignationRequest request) {
        try {
            Trajet trajet = transportService.assignerChauffeurEtBus(id, request.getChauffeurId(), request.getBusId());
            return ResponseEntity.ok(trajet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== TARIFS ====================

    @GetMapping("/tarifs")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<List<TarifResponse>> getAllTarifs() {
        return ResponseEntity.ok(transportService.getAllTarifs().stream()
                .map(this::mapToTarifResponse).collect(Collectors.toList()));
    }

    @PostMapping("/tarifs")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Tarif> saveTarif(@RequestBody Tarif tarif) {
        return ResponseEntity.ok(transportService.saveTarif(tarif));
    }

    @DeleteMapping("/tarifs/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Void> deleteTarif(@PathVariable Long id) {
        transportService.deleteTarif(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== CHAUFFEURS ====================

    @GetMapping("/chauffeurs")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<List<ChauffeurResponse>> getAllChauffeurs() {
        return ResponseEntity.ok(transportService.getAllChauffeurs().stream()
                .map(this::mapToChauffeurResponse).collect(Collectors.toList()));
    }

    @PostMapping("/chauffeurs")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Chauffeur> saveChauffeur(@RequestBody Chauffeur chauffeur) {
        return ResponseEntity.ok(transportService.saveChauffeur(chauffeur));
    }

    @DeleteMapping("/chauffeurs/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPONSABLE')")
    public ResponseEntity<Void> deleteChauffeur(@PathVariable Long id) {
        transportService.deleteChauffeur(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== CLASSES DE MAPPING ====================

    private LigneResponse mapToLigneResponse(Ligne l) {
        return LigneResponse.builder()
                .id(l.getId())
                .nom(l.getNom())
                .description(l.getDescription())
                .build();
    }

    private ArretResponse mapToArretResponse(Arret a) {
        return ArretResponse.builder()
                .id(a.getId())
                .nom(a.getNom())
                .latitude(a.getLatitude())
                .longitude(a.getLongitude())
                .ordre(a.getOrdre())
                .ligneId(a.getLigne().getId())
                .build();
    }

    private BusResponse mapToBusResponse(Bus b) {
        return BusResponse.builder()
                .id(b.getId())
                .matricule(b.getMatricule())
                .modele(b.getModele())
                .capacite(b.getCapacite())
                .statut(b.getStatut().name())
                .chauffeurId(b.getChauffeur() != null ? b.getChauffeur().getId() : null)
                .chauffeurNom(b.getChauffeur() != null ? b.getChauffeur().getNom() : null)
                .chauffeurPrenom(b.getChauffeur() != null ? b.getChauffeur().getPrenom() : null)
                .etablissementId(b.getEtablissement() != null ? b.getEtablissement().getId() : null)
                .etablissementNom(b.getEtablissement() != null ? b.getEtablissement().getNom() : null)
                .telephoneChauffeur(b.getTelephoneChauffeur())
                .heureDebut(b.getHeureDebut())
                .heureFin(b.getHeureFin())
                .description(b.getDescription())
                .actif(b.isActif())
                .build();
    }

    private TrajetResponse mapToTrajetResponse(Trajet t) {
        return TrajetResponse.builder()
                .id(t.getId())
                .heureDepart(t.getHeureDepart())
                .heureArrivee(t.getHeureArrivee())
                .joursSemaine(t.getJoursSemaine())
                .ligneId(t.getLigne().getId())
                .busId(t.getBus() != null ? t.getBus().getId() : null)
                .chauffeurId(t.getChauffeur() != null ? t.getChauffeur().getId() : null)
                .placesDisponibles(t.getPlacesDisponibles())
                .build();
    }

    private TarifResponse mapToTarifResponse(Tarif t) {
        return TarifResponse.builder()
                .id(t.getId())
                .typeAbonnement(t.getTypeAbonnement())
                .montant(t.getMontant())
                .description(t.getDescription())
                .build();
    }

    private ChauffeurResponse mapToChauffeurResponse(Chauffeur c) {
        return ChauffeurResponse.builder()
                .id(c.getId())
                .nom(c.getNom())
                .prenom(c.getPrenom())
                .email(c.getEmail())
                .telephone(c.getTelephone())
                .numeroPermis(c.getNumeroPermis())
                .actif(c.isActif())
                .build();
    }

    // ==================== CLASSE INTERNE POUR LA REQUETE D'ASSIGNATION ====================

    public static class AssignationRequest {
        private Long chauffeurId;
        private Long busId;

        public Long getChauffeurId() {
            return chauffeurId;
        }

        public void setChauffeurId(Long chauffeurId) {
            this.chauffeurId = chauffeurId;
        }

        public Long getBusId() {
            return busId;
        }

        public void setBusId(Long busId) {
            this.busId = busId;
        }
    }
}