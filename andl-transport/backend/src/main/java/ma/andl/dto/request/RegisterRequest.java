package ma.andl.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    @NotBlank @Size(max = 50)
    private String nom;

    @NotBlank @Size(max = 50)
    private String prenom;

    @NotBlank @Email @Size(max = 100)
    private String email;

    @NotBlank @Size(min = 6)
    private String motDePasse;

    private String telephone;

    // Champs spécifiques étudiant
    @NotNull
    private LocalDate dateNaissance;

    @NotBlank
    private String etablissement;

    @NotBlank
    private String niveauScolaire;

    @NotBlank
    private String anneeScolaire;
}
