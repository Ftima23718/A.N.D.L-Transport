package ma.andl.controller;

import ma.andl.dto.response.*;
import ma.andl.model.entity.*;
import ma.andl.service.TransportAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transport")
@PreAuthorize("hasRole('ADMIN')")
public class TransportController {

    private final TransportAdminService transportService;

    public TransportController(TransportAdminService transportService) {
        this.transportService = transportService;
    }

    // Lignes
    @GetMapping("/lignes")
    public ResponseEntity<List<LigneResponse>> getAllLignes() {
        return ResponseEntity.ok(transportService.getAllLignes().stream()
                .map(this::mapToLigneResponse).collect(Collectors.toList()));
    }

    @PostMapping("/lignes")
    public ResponseEntity<Ligne> saveLigne(@RequestBody Ligne ligne) {
        return ResponseEntity.ok(transportService.saveLigne(ligne));
    }

    @DeleteMapping("/lignes/{id}")
    public ResponseEntity<Void> deleteLigne(@PathVariable Long id) {
        transportService.deleteLigne(id);
        return ResponseEntity.noContent().build();
    }

    // Arrets
    @GetMapping("/arrets")
    public ResponseEntity<List<ArretResponse>> getAllArrets() {
        return ResponseEntity.ok(transportService.getAllArrets().stream()
                .map(this::mapToArretResponse).collect(Collectors.toList()));
    }

    @PostMapping("/arrets")
    public ResponseEntity<Arret> saveArret(@RequestBody Arret arret) {
        return ResponseEntity.ok(transportService.saveArret(arret));
    }

    @DeleteMapping("/arrets/{id}")
    public ResponseEntity<Void> deleteArret(@PathVariable Long id) {
        transportService.deleteArret(id);
        return ResponseEntity.noContent().build();
    }

    // Bus
    @GetMapping("/bus")
    public ResponseEntity<List<BusResponse>> getAllBus() {
        return ResponseEntity.ok(transportService.getAllBus().stream()
                .map(this::mapToBusResponse).collect(Collectors.toList()));
    }

    @PostMapping("/bus")
    public ResponseEntity<Bus> saveBus(@RequestBody Bus bus) {
        return ResponseEntity.ok(transportService.saveBus(bus));
    }

    @DeleteMapping("/bus/{id}")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        transportService.deleteBus(id);
        return ResponseEntity.noContent().build();
    }

    // Trajets
    @GetMapping("/trajets")
    public ResponseEntity<List<TrajetResponse>> getAllTrajets() {
        return ResponseEntity.ok(transportService.getAllTrajets().stream()
                .map(this::mapToTrajetResponse).collect(Collectors.toList()));
    }

    @PostMapping("/trajets")
    public ResponseEntity<Trajet> saveTrajet(@RequestBody Trajet trajet) {
        return ResponseEntity.ok(transportService.saveTrajet(trajet));
    }

    @DeleteMapping("/trajets/{id}")
    public ResponseEntity<Void> deleteTrajet(@PathVariable Long id) {
        transportService.deleteTrajet(id);
        return ResponseEntity.noContent().build();
    }

    // Tarifs
    @GetMapping("/tarifs")
    public ResponseEntity<List<TarifResponse>> getAllTarifs() {
        return ResponseEntity.ok(transportService.getAllTarifs().stream()
                .map(this::mapToTarifResponse).collect(Collectors.toList()));
    }

    @PostMapping("/tarifs")
    public ResponseEntity<Tarif> saveTarif(@RequestBody Tarif tarif) {
        return ResponseEntity.ok(transportService.saveTarif(tarif));
    }

    @DeleteMapping("/tarifs/{id}")
    public ResponseEntity<Void> deleteTarif(@PathVariable Long id) {
        transportService.deleteTarif(id);
        return ResponseEntity.noContent().build();
    }

    // Chauffeurs
    @GetMapping("/chauffeurs")
    public ResponseEntity<List<ChauffeurResponse>> getAllChauffeurs() {
        return ResponseEntity.ok(transportService.getAllChauffeurs().stream()
                .map(this::mapToChauffeurResponse).collect(Collectors.toList()));
    }

    @PostMapping("/chauffeurs")
    public ResponseEntity<Chauffeur> saveChauffeur(@RequestBody Chauffeur chauffeur) {
        return ResponseEntity.ok(transportService.saveChauffeur(chauffeur));
    }

    @DeleteMapping("/chauffeurs/{id}")
    public ResponseEntity<Void> deleteChauffeur(@PathVariable Long id) {
        transportService.deleteChauffeur(id);
        return ResponseEntity.noContent().build();
    }

    // Mapping helpers
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
                .immatriculation(b.getImmatriculation())
                .modele(b.getModele())
                .capacite(b.getCapacite())
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
}
