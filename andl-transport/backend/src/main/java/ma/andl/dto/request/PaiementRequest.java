package ma.andl.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaiementRequest {
    @NotNull
    private Long inscriptionId;

    @NotNull
    @Positive
    private Double montant;

    private String methodePaiement;
}
