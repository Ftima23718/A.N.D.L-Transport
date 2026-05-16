package ma.andl.service;

import ma.andl.dto.response.StatsResponse;
import ma.andl.model.enums.StatutBus;
import ma.andl.model.enums.StatutInscription;
import ma.andl.model.enums.StatutPaiement;
import ma.andl.repository.*;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final EtudiantRepository etudiantRepository;
    private final InscriptionRepository inscriptionRepository;
    private final PaiementRepository paiementRepository;
    private final EtablissementRepository etablissementRepository;
    private final BusRepository busRepository;

    public AdminService(EtudiantRepository etudiantRepository,
                        InscriptionRepository inscriptionRepository,
                        PaiementRepository paiementRepository,
                        EtablissementRepository etablissementRepository,
                        BusRepository busRepository) {
        this.etudiantRepository = etudiantRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.paiementRepository = paiementRepository;
        this.etablissementRepository = etablissementRepository;
        this.busRepository = busRepository;
    }

    public StatsResponse getStats() {
        return StatsResponse.builder()
                .totalEtudiants(etudiantRepository.count())
                .inscriptionsEnAttente(inscriptionRepository.count()) // Normalement filter par statut
                .inscriptionsValidees(inscriptionRepository.count()) // Placeholder filter
                .totalMontantEncaisse(paiementRepository.findAll().stream()
                        .filter(p -> p.getStatut() == StatutPaiement.PAYE)
                        .mapToDouble(p -> p.getMontant())
                        .sum())
                .totalEtablissements(etablissementRepository.count())
                .totalBusActive(busRepository.count()) // Placeholder filter StatutBus.ACTIF
                .build();
    }
}
