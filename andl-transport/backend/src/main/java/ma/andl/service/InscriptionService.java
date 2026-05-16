package ma.andl.service;

import ma.andl.dto.request.InscriptionRequest;
import ma.andl.dto.response.InscriptionResponse;
import ma.andl.model.entity.Etudiant;
import ma.andl.model.entity.Inscription;
import ma.andl.model.entity.Ligne;
import ma.andl.model.enums.StatutInscription;
import ma.andl.repository.EtudiantRepository;
import ma.andl.repository.InscriptionRepository;
import ma.andl.repository.LigneRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InscriptionService {

    private final InscriptionRepository inscriptionRepository;
    private final EtudiantRepository etudiantRepository;
    private final LigneRepository ligneRepository;
    private final BadgeService badgeService;

    public InscriptionService(InscriptionRepository inscriptionRepository, 
                              EtudiantRepository etudiantRepository,
                              LigneRepository ligneRepository,
                              BadgeService badgeService) {
        this.inscriptionRepository = inscriptionRepository;
        this.etudiantRepository = etudiantRepository;
        this.ligneRepository = ligneRepository;
        this.badgeService = badgeService;
    }

    @Transactional
    public InscriptionResponse soumettre(InscriptionRequest request, String email) {
        Etudiant etudiant = etudiantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        Ligne ligne = null;
        if (request.getLigneId() != null) {
            ligne = ligneRepository.findById(request.getLigneId()).orElse(null);
        }

        Inscription inscription = Inscription.builder()
                .statut(StatutInscription.EN_ATTENTE)
                .typeAbonnement(request.getTypeAbonnement())
                .etudiant(etudiant)
                .ligne(ligne)
                .build();

        return mapToResponse(inscriptionRepository.save(inscription));
    }

    @Transactional
    public void valider(Long id) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        inscription.setStatut(StatutInscription.VALIDEE);
        inscriptionRepository.save(inscription);
        
        // Générer le badge automatiquement à la validation
        badgeService.generateBadge(id);
    }

    @Transactional
    public void rejeter(Long id, String motif) {
        Inscription inscription = inscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        inscription.setStatut(StatutInscription.REJETEE);
        inscription.setMotifRejet(motif);
        inscriptionRepository.save(inscription);
    }

    public List<InscriptionResponse> getMesInscriptions(String email) {
        return inscriptionRepository.findByEtudiantEmail(email)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Page<InscriptionResponse> getAll(Pageable pageable) {
        return inscriptionRepository.findAll(pageable).map(this::mapToResponse);
    }

    private InscriptionResponse mapToResponse(Inscription i) {
        return InscriptionResponse.builder()
                .id(i.getId())
                .etudiantNom(i.getEtudiant().getNom())
                .etudiantPrenom(i.getEtudiant().getPrenom())
                .statut(i.getStatut())
                .typeAbonnement(i.getTypeAbonnement())
                .dateDebut(i.getDateDebut())
                .dateFin(i.getDateFin())
                .ligneNom(i.getLigne() != null ? i.getLigne().getNom() : null)
                .dateCreation(i.getDateCreation())
                .motifRejet(i.getMotifRejet())
                .aBadge(i.getBadge() != null)
                .build();
    }
}
