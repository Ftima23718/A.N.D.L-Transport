package ma.andl.service;

import ma.andl.dto.response.ResponsableStatsResponse;
import ma.andl.model.entity.Ligne;
import ma.andl.model.enums.StatutBus;
import ma.andl.model.enums.StatutInscription;
import ma.andl.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResponsableService {

    private final LigneRepository ligneRepository;
    private final BusRepository busRepository;
    private final ChauffeurRepository chauffeurRepository;
    private final InscriptionRepository inscriptionRepository;
    private final TrajetRepository trajetRepository;

    public ResponsableService(LigneRepository ligneRepository,
                              BusRepository busRepository,
                              ChauffeurRepository chauffeurRepository,
                              InscriptionRepository inscriptionRepository,
                              TrajetRepository trajetRepository) {
        this.ligneRepository = ligneRepository;
        this.busRepository = busRepository;
        this.chauffeurRepository = chauffeurRepository;
        this.inscriptionRepository = inscriptionRepository;
        this.trajetRepository = trajetRepository;
    }

    public ResponsableStatsResponse getStats() {
        long totalLignes = ligneRepository.count();
        long totalLignesActives = ligneRepository.countByActifTrue();

        long totalBus = busRepository.count();
        long totalBusActifs = busRepository.countByStatut(StatutBus.ACTIF);

        long totalChauffeurs = chauffeurRepository.count();
        long totalChauffeursActifs = chauffeurRepository.countByActifTrue();

        long totalEtudiantsInscrits = inscriptionRepository.countByStatut(StatutInscription.VALIDEE);

        // Nombre d'étudiants par ligne
        Map<String, Long> rekabParLigne = inscriptionRepository.findByStatut(StatutInscription.VALIDEE)
                .stream()
                .filter(ins -> ins.getLigne() != null)
                .collect(Collectors.groupingBy(
                        ins -> ins.getLigne().getNom(),
                        Collectors.counting()
                ));

        // Places disponibles par ligne
        Map<String, Integer> placesParLigne = new HashMap<>();
        for (Ligne ligne : ligneRepository.findAll()) {
            int totalPlaces = trajetRepository.findByLigneId(ligne.getId())
                    .stream()
                    .mapToInt(t -> t.getPlacesDisponibles() != null ? t.getPlacesDisponibles() : 0)
                    .sum();
            placesParLigne.put(ligne.getNom(), totalPlaces);
        }

        return ResponsableStatsResponse.builder()
                .totalLignes(totalLignes)
                .totalLignesActives(totalLignesActives)
                .totalBus(totalBus)
                .totalBusActifs(totalBusActifs)
                .totalChauffeurs(totalChauffeurs)
                .totalChauffeursActifs(totalChauffeursActifs)
                .totalEtudiantsInscrits(totalEtudiantsInscrits)
                .rekabParLigne(rekabParLigne)
                .placesParLigne(placesParLigne)
                .build();
    }

    public Map<String, Object> getLignesAvecNombreEtudiants() {
        Map<String, Object> result = new HashMap<>();
        result.put("lignes", ligneRepository.findAll());
        result.put("rekabParLigne", inscriptionRepository.findByStatut(StatutInscription.VALIDEE)
                .stream()
                .filter(ins -> ins.getLigne() != null)
                .collect(Collectors.groupingBy(
                        ins -> ins.getLigne().getId(),
                        Collectors.counting()
                )));
        return result;
    }
}