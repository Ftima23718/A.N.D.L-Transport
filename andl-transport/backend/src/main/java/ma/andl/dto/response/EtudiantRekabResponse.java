package ma.andl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtudiantRekabResponse {
    private Long id;
    private String numeroEtudiant;
    private String nom;
    private String prenom;
    private String telephone;
    private String niveauScolaire;
    private String arretNom;           // Point d'arrêt où l'étudiant monte
    private boolean qrVerifieAujourdhui;  // Si le QR a été scanné aujourd'hui
    private String photoUrl;
}