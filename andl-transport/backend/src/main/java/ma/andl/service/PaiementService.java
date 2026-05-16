package ma.andl.service;

import ma.andl.dto.response.PaiementResponse;
import ma.andl.model.entity.Paiement;
import ma.andl.model.enums.StatutPaiement;
import ma.andl.repository.PaiementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaiementService {

    private final PaiementRepository paiementRepository;

    public PaiementService(PaiementRepository paiementRepository) {
        this.paiementRepository = paiementRepository;
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
