package ma.andl.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ma.andl.model.enums.TypeAbonnement;

@Data
public class InscriptionRequest {
    @NotNull
    private TypeAbonnement typeAbonnement;

    private Long ligneId;
}
