package ma.andl.dto.response;

import lombok.*;
import ma.andl.model.enums.TypeAbonnement;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TarifResponse {
    private Long id;
    private TypeAbonnement typeAbonnement;
    private Double montant;
    private String description;
}
