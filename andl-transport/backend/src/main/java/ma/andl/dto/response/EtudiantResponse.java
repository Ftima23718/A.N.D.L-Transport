package ma.andl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EtudiantResponse extends UserResponse {
    private String numeroEtudiant;
    private LocalDate dateNaissance;
    private String etablissementNom;
    private String niveauScolaire;
    private String anneeScolaire;
    private String photoUrl;
}
