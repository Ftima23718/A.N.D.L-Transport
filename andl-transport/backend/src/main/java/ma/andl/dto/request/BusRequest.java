package ma.andl.dto.request;

import lombok.*;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusRequest {
    private String matricule;
    private String nom;
    private String modele;
    private Integer capacite;
    private String statut;
    private Long chauffeurId;
    private Long etablissementId;
    private String telephoneChauffeur;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String description;
}
