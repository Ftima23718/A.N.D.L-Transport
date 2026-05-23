// ma/andl/dto/response/ItineraireResponse.java
package ma.andl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraireResponse {
    private Long ligneId;
    private String ligneNom;
    private String ligneDescription;
    private List<ArretItineraire> arrets;
    private ProchainTrajet prochainTrajet;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ArretItineraire {
        private Long id;
        private String nom;
        private Double latitude;
        private Double longitude;
        private Integer ordre;
        private boolean isDepart;
        private boolean isDestination;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProchainTrajet {
        private LocalTime heureDepart;
        private LocalTime heureArrivee;
        private String minutesRestantes;
        private String busMatricule;
    }
}