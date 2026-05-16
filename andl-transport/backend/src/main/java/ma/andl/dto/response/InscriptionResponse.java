package ma.andl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.andl.model.enums.StatutInscription;
import ma.andl.model.enums.TypeAbonnement;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InscriptionResponse {
    private Long id;
    private String etudiantNom;
    private String etudiantPrenom;
    private StatutInscription statut;
    private TypeAbonnement typeAbonnement;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String ligneNom;
    private LocalDateTime dateCreation;
    private String motifRejet;
    private boolean aBadge;
}
