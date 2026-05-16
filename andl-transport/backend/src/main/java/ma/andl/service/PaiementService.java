package ma.andl.service;

import ma.andl.dto.request.PaiementRequest;
import ma.andl.dto.response.PaiementResponse;
import ma.andl.model.entity.Inscription;
import ma.andl.model.entity.Paiement;
import ma.andl.model.enums.StatutPaiement;
import ma.andl.repository.InscriptionRepository;
import ma.andl.repository.PaiementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final InscriptionRepository inscriptionRepository;

    public PaiementService(PaiementRepository paiementRepository, InscriptionRepository inscriptionRepository) {
        this.paiementRepository = paiementRepository;
        this.inscriptionRepository = inscriptionRepository;
    }

    @Transactional
    public void enregistrerPaiement(PaiementRequest request) {
        Inscription inscription = inscriptionRepository.findById(request.getInscriptionId())
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));
        
        Paiement paiement = Paiement.builder()
                .montant(request.getMontant())
                .datePaiement(LocalDateTime.now())
                .statut(StatutPaiement.PAYE)
                .methodePaiement(request.getMethodePaiement())
                .inscription(inscription)
                .build();
        
        paiementRepository.save(paiement);
    }

    public List<PaiementResponse> getAll() {
        return paiementRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<PaiementResponse> getByEtudiant(Long etudiantId) {
        return paiementRepository.findByInscriptionEtudiantId(etudiantId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void validerPaiement(Long id) {
        Paiement paiement = paiementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paiement non trouvé"));
        paiement.setStatut(StatutPaiement.PAYE);
        paiement.setDatePaiement(LocalDateTime.now());
        paiementRepository.save(paiement);
    }

    private PaiementResponse mapToResponse(Paiement p) {
        return PaiementResponse.builder()
                .id(p.getId())
                .montant(p.getMontant())
                .datePaiement(p.getDatePaiement())
                .statut(p.getStatut())
                .methodePaiement(p.getMethodePaiement())
                .inscriptionId(p.getInscription().getId())
                .etudiantNom(p.getInscription().getEtudiant().getNom())
                .etudiantPrenom(p.getInscription().getEtudiant().getPrenom())
                .build();
    }
}
