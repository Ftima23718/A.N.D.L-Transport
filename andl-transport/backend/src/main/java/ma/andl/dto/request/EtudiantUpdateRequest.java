package ma.andl.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EtudiantUpdateRequest {
    @NotBlank @Size(max = 50)
    private String nom;

    @NotBlank @Size(max = 50)
    private String prenom;

    @NotBlank @Email @Size(max = 100)
    private String email;

    private String telephone;

    @NotNull
    private LocalDate dateNaissance;

    private String filiere;

    @NotBlank
    private String niveauScolaire;

    @NotBlank
    private String anneeScolaire;

    private boolean actif;
}
