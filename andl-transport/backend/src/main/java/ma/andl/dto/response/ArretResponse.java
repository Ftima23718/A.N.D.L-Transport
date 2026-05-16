package ma.andl.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArretResponse {
    private Long id;
    private String nom;
    private Double latitude;
    private Double longitude;
    private Integer ordre;
    private Long ligneId;
}
