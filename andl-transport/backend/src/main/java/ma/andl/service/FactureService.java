package ma.andl.service;

import ma.andl.dto.request.FactureRequest;
import ma.andl.dto.response.FactureResponse;
import ma.andl.model.entity.*;
import ma.andl.model.enums.StatutFacture;
import ma.andl.model.enums.StatutPaiement;
import ma.andl.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FactureService {

    private final FactureRepository factureRepository;
    private final EtudiantRepository etudiantRepository;
    private final InscriptionRepository inscriptionRepository;
    private final TarifRepository tarifRepository;
    private final PaiementRepository paiementRepository;

    public FactureService(FactureRepository factureRepository,
                         EtudiantRepository etudiantRepository,
                         InscriptionRepository inscriptionRepository,
                         TarifRepository tarifRepository,
                         PaiementRepository paiementRepository) {
        this.factureRepository = factureRepository;
        this.etudiantRepository = etudiantRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.tarifRepository = tarifRepository;
        this.paiementRepository = paiementRepository;
    }

    public List<FactureResponse> getAllFactures() {
        return factureRepository.findAll().stream()
                .map(this::mapToFactureResponse)
                .collect(Collectors.toList());
    }

    public Page<FactureResponse> getFacturesPaginated(Pageable pageable) {
        return factureRepository.findAll(pageable)
                .map(this::mapToFactureResponse);
    }

    public Optional<FactureResponse> getFactureById(Long id) {
        return factureRepository.findById(id)
                .map(this::mapToFactureResponse);
    }

    public List<FactureResponse> getFacturesByEtudiant(Long etudiantId) {
        return factureRepository.findByEtudiantId(etudiantId, Pageable.unpaged())
                .getContent().stream()
                .map(this::mapToFactureResponse)
                .collect(Collectors.toList());
    }

    public List<FactureResponse> getFacturesByStatut(StatutFacture statut) {
        return factureRepository.findByStatut(statut).stream()
                .map(this::mapToFactureResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public Facture createFacture(FactureRequest request) {
        Etudiant etudiant = etudiantRepository.findById(request.getEtudiantId())
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        Facture facture = Facture.builder()
                .numero(generateNumeroFacture())
                .etudiant(etudiant)
                .montant(request.getMontant())
                .statut(StatutFacture.CREEE)
                .dateEmission(request.getDateEmission() != null ? request.getDateEmission() : LocalDate.now())
                .dateEcheance(request.getDateEcheance())
                .description(request.getDescription())
                .build();

        if (request.getInscriptionId() != null) {
            Inscription inscription = inscriptionRepository.findById(request.getInscriptionId()).orElse(null);
            facture.setInscription(inscription);
        }

        if (request.getTarifId() != null) {
            Tarif tarif = tarifRepository.findById(request.getTarifId()).orElse(null);
            facture.setTarif(tarif);
        }

        return factureRepository.save(facture);
    }

    @Transactional
    public Facture updateFacture(Long id, FactureRequest request) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));

        facture.setMontant(request.getMontant());
        facture.setDateEcheance(request.getDateEcheance());
        facture.setDescription(request.getDescription());

        return factureRepository.save(facture);
    }

    @Transactional
    public Facture emetFacture(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        facture.setStatut(StatutFacture.EMISE);
        return factureRepository.save(facture);
    }

    @Transactional
    public Facture payerFacture(Long id, Double montantPaye) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));

        if (montantPaye >= facture.getMontant()) {
            facture.setStatut(StatutFacture.PAYEE);
            facture.setDatePaiement(LocalDate.now());

            // Mettre à jour le paiement associé si exists
            if (facture.getInscription() != null && facture.getInscription().getPaiement() != null) {
                Paiement paiement = facture.getInscription().getPaiement();
                paiement.setStatut(StatutPaiement.PAYE);
                paiement.setDatePaiement(java.time.LocalDateTime.now());
                paiementRepository.save(paiement);
            }
        } else {
            facture.setStatut(StatutFacture.PARTIELLEMENT_PAYEE);
        }

        return factureRepository.save(facture);
    }

    @Transactional
    public Facture annulerFacture(Long id) {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
        facture.setStatut(StatutFacture.ANNULEE);
        return factureRepository.save(facture);
    }

    @Transactional
    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }

    public List<Facture> getFacturesByDate(LocalDate debut, LocalDate fin) {
        return factureRepository.findByDateEmissionBetween(debut, fin);
    }

    private String generateNumeroFacture() {
        long count = factureRepository.count() + 1;
        return String.format("FACT-%05d-%tY%<tm%<td", count, LocalDate.now());
    }

    private FactureResponse mapToFactureResponse(Facture facture) {
        return FactureResponse.builder()
                .id(facture.getId())
                .numero(facture.getNumero())
                .etudiantId(facture.getEtudiant().getId())
                .etudiantNom(facture.getEtudiant().getNom())
                .etudiantPrenom(facture.getEtudiant().getPrenom())
                .etudiantEmail(facture.getEtudiant().getEmail())
                .inscriptionId(facture.getInscription() != null ? facture.getInscription().getId() : null)
                .tarifId(facture.getTarif() != null ? facture.getTarif().getId() : null)
                .typeAbonnement(facture.getTarif() != null ? facture.getTarif().getTypeAbonnement().name() : null)
                .montant(facture.getMontant())
                .statut(facture.getStatut().name())
                .dateEmission(facture.getDateEmission())
                .dateEcheance(facture.getDateEcheance())
                .datePaiement(facture.getDatePaiement())
                .description(facture.getDescription())
                .dateCreation(facture.getDateCreation())
                .build();
    }
}
