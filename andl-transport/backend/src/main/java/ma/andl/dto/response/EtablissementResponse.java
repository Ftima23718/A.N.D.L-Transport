package ma.andl.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EtablissementResponse {
    private Long id;
    private String nom;
    private String adresse;
    private String ville;
    private String telephone;
    private String responsable;
    private String niveauScolaire;
    private Double latitude;
    private Double longitude;
    private Long nombreEtudiants;
    private Long nombreTransports;
    private boolean actif;
}
