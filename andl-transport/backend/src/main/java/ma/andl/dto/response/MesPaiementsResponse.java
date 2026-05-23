// ma/andl/dto/response/MesPaiementsResponse.java
package ma.andl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MesPaiementsResponse {
    private Long id;
    private String periode;
    private Double montant;
    private LocalDate datePaiement;
    private String statut;
    private String methodePaiement;
    private String typeAbonnement;
    private String factureUrl;
    private Long factureId;
}