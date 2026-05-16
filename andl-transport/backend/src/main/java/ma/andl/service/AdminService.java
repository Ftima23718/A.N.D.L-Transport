package ma.andl.service;

import ma.andl.dto.response.StatsResponse;
import ma.andl.model.enums.StatutInscription;
import ma.andl.model.enums.StatutPaiement;
import ma.andl.repository.*;
import org.springframework.stereotype.Service;

import java.time.format.TextStyle;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

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
                .inscriptionsEnAttente(inscriptionRepository.countByStatut(StatutInscription.EN_ATTENTE))
                .inscriptionsValidees(inscriptionRepository.countByStatut(StatutInscription.VALIDEE))
                .totalMontantEncaisse(paiementRepository.findAll().stream()
                        .filter(p -> p.getStatut() == StatutPaiement.PAYE)
                        .mapToDouble(p -> p.getMontant())
                        .sum())
                .totalEtablissements(etablissementRepository.count())
                .totalBusActive(busRepository.count())
                .inscriptionsParMois(getInscriptionsParMois())
                .revenusParMois(getRevenusParMois())
                .build();
    }

    private Map<String, Long> getInscriptionsParMois() {
        return inscriptionRepository.findAll().stream()
                .filter(i -> i.getDateCreation() != null)
                .collect(Collectors.groupingBy(
                        i -> i.getDateCreation().getMonth().getDisplayName(TextStyle.SHORT, Locale.FRENCH)
                                + " " + i.getDateCreation().getYear(),
                        Collectors.counting()
                ));
    }

    private Map<String, Double> getRevenusParMois() {
        return paiementRepository.findAll().stream()
                .filter(p -> p.getStatut() == StatutPaiement.PAYE && p.getDatePaiement() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getDatePaiement().getMonth().getDisplayName(TextStyle.SHORT, Locale.FRENCH)
                                + " " + p.getDatePaiement().getYear(),
                        Collectors.summingDouble(p -> p.getMontant())
                ));
    }
}
