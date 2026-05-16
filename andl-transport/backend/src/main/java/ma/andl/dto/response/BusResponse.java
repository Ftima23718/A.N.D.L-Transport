package ma.andl.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusResponse {
    private Long id;
    private String immatriculation;
    private String modele;
    private Integer capacite;
    private boolean actif;
}
