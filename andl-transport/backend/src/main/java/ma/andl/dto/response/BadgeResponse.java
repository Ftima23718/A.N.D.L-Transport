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
public class BadgeResponse {
    private Long id;
    private String codeQr;
    private LocalDate dateExpiration;
    private boolean estValide;
    private String qrCodeBase64;
    
    // Infos requises sur la carte
    private String numeroEtudiant;
    private String etudiantNom;
    private String etudiantPrenom;
    private String etablissement;
    private String niveauScolaire;
    private String anneeScolaire;
    private LocalDate dateNaissance;
    private String ligneNom;
}
