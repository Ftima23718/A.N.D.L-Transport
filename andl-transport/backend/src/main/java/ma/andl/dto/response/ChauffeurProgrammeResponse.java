package ma.andl.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChauffeurProgrammeResponse {
    private Long trajetId;
    private Long ligneId;
    private String ligneNom;
    private String ligneDescription;
    private LocalTime heureDepart;
    private LocalTime heureArrivee;
    private String joursSemaine;
    private String busMatricule;
    private String busModele;
    private Integer placesDisponibles;
    private Integer placesOccupees;  // Nombre d'étudiants inscrits sur cette ligne
}