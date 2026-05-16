package ma.andl.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChauffeurResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String numeroPermis;
    private boolean actif;
}
