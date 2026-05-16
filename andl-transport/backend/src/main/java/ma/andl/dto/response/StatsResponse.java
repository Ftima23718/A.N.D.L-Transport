package ma.andl.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class StatsResponse {
    private long totalEtudiants;
    private long inscriptionsEnAttente;
    private long inscriptionsValidees;
    private double totalMontantEncaisse;
    private long totalEtablissements;
    private long totalBusActive;
    private Map<String, Long> inscriptionsParMois;
    private Map<String, Double> revenusParMois;
}
