package ma.andl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponsableStatsResponse {
    private long totalLignes;
    private long totalLignesActives;
    private long totalBus;
    private long totalBusActifs;
    private long totalChauffeurs;
    private long totalChauffeursActifs;
    private long totalEtudiantsInscrits;
    private Map<String, Long> rekabParLigne;    // Nom de ligne → nombre d'étudiants
    private Map<String, Integer> placesParLigne; // Nom de ligne → places disponibles
}