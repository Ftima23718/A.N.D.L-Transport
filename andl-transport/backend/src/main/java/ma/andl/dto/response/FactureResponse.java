package ma.andl.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FactureResponse {
    private Long id;
    private String numero;
    private Long etudiantId;
    private String etudiantNom;
    private String etudiantPrenom;
    private String etudiantEmail;
    private Long inscriptionId;
    private Long tarifId;
    private String typeAbonnement;
    private Double montant;
    private String statut;
    private LocalDate dateEmission;
    private LocalDate dateEcheance;
    private LocalDate datePaiement;
    private String description;
    private LocalDateTime dateCreation;
}
