package ma.andl.dto.response;

import lombok.*;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusResponse {
    private Long id;
    private String matricule;
    private String nom;
    private String modele;
    private Integer capacite;
    private String statut;
    private Long chauffeurId;
    private String chauffeurNom;
    private String chauffeurPrenom;
    private Long etablissementId;
    private String etablissementNom;
    private String telephoneChauffeur;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String description;
    private boolean actif;
}
