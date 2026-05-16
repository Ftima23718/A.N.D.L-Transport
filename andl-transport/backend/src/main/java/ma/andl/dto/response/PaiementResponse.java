package ma.andl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.andl.model.enums.StatutPaiement;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementResponse {
    private Long id;
    private Double montant;
    private LocalDateTime datePaiement;
    private StatutPaiement statut;
    private String methodePaiement;
    private Long inscriptionId;
    private String etudiantNom;
    private String etudiantPrenom;
}
