package ma.andl.dto.request;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureRequest {
    private Long etudiantId;
    private Long inscriptionId;
    private Long tarifId;
    private Double montant;
    private LocalDate dateEmission;
    private LocalDate dateEcheance;
    private String description;
}
