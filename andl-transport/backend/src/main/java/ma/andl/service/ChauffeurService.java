package ma.andl.service;

import ma.andl.dto.response.ChauffeurProgrammeResponse;
import ma.andl.dto.response.EtudiantRekabResponse;
import ma.andl.model.entity.*;
import ma.andl.model.enums.StatutInscription;
import ma.andl.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChauffeurService {

    private final ChauffeurRepository chauffeurRepository;
    private final TrajetRepository trajetRepository;
    private final InscriptionRepository inscriptionRepository;
    private final BadgeRepository badgeRepository;
    private final BusRepository busRepository;

    public ChauffeurService(ChauffeurRepository chauffeurRepository,
                            TrajetRepository trajetRepository,
                            InscriptionRepository inscriptionRepository,
                            BadgeRepository badgeRepository,
                            BusRepository busRepository) {
        this.chauffeurRepository = chauffeurRepository;
        this.trajetRepository = trajetRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.badgeRepository = badgeRepository;
        this.busRepository = busRepository;
    }

    public List<ChauffeurProgrammeResponse> getProgrammeByChauffeur(String email, String jour) {
        Chauffeur chauffeur = chauffeurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));

        List<Trajet> trajets;
        if (jour != null && !jour.isEmpty()) {
            trajets = trajetRepository.findByChauffeurIdAndJoursSemaineContaining(chauffeur.getId(), jour);
        } else {
            trajets = trajetRepository.findByChauffeurId(chauffeur.getId());
        }

        return trajets.stream().map(this::mapToProgrammeResponse).collect(Collectors.toList());
    }

    public List<EtudiantRekabResponse> getEtudiantsByChauffeur(String email) {
        Chauffeur chauffeur = chauffeurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));

        // Récupérer la ligne via le bus du chauffeur
        Bus bus = busRepository.findByChauffeurId(chauffeur.getId()).stream().findFirst().orElse(null);
        if (bus == null || bus.getLigne() == null) {
            return List.of();
        }

        Ligne ligne = bus.getLigne();

        // Récupérer toutes les inscriptions VALIDEES sur cette ligne
        List<Inscription> inscriptions = inscriptionRepository.findByLigneIdAndStatut(ligne.getId(), StatutInscription.VALIDEE);

        return inscriptions.stream()
                .map(ins -> mapToRekabResponse(ins, ligne))
                .collect(Collectors.toList());
    }

    public Ligne getLigneByChauffeur(String email) {
        Chauffeur chauffeur = chauffeurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));

        Bus bus = busRepository.findByChauffeurId(chauffeur.getId()).stream().findFirst().orElse(null);
        if (bus != null && bus.getLigne() != null) {
            return bus.getLigne();
        }
        return null;
    }

    private ChauffeurProgrammeResponse mapToProgrammeResponse(Trajet trajet) {
        long nbInscrits = inscriptionRepository.countByLigneIdAndStatut(trajet.getLigne().getId(), StatutInscription.VALIDEE);
        int placesOccupees = (int) nbInscrits;

        return ChauffeurProgrammeResponse.builder()
                .trajetId(trajet.getId())
                .ligneId(trajet.getLigne().getId())
                .ligneNom(trajet.getLigne().getNom())
                .ligneDescription(trajet.getLigne().getDescription())
                .heureDepart(trajet.getHeureDepart())
                .heureArrivee(trajet.getHeureArrivee())
                .joursSemaine(trajet.getJoursSemaine())
                .busMatricule(trajet.getBus() != null ? trajet.getBus().getMatricule() : null)
                .busModele(trajet.getBus() != null ? trajet.getBus().getModele() : null)
                .placesDisponibles(trajet.getPlacesDisponibles())
                .placesOccupees(placesOccupees)
                .build();
    }

    private EtudiantRekabResponse mapToRekabResponse(Inscription inscription, Ligne ligne) {
        Etudiant e = inscription.getEtudiant();

        return EtudiantRekabResponse.builder()
                .id(e.getId())
                .numeroEtudiant(e.getNumeroEtudiant())
                .nom(e.getNom())
                .prenom(e.getPrenom())
                .telephone(e.getTelephone())
                .niveauScolaire(e.getNiveauScolaire())
                .photoUrl(e.getPhotoUrl())
                .arretNom("À déterminer")  // À implémenter selon les besoins
                .qrVerifieAujourdhui(false)  // À implémenter avec historique des scans
                .build();
    }
}