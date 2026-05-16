package ma.andl.dto.response;

import lombok.*;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrajetResponse {
    private Long id;
    private LocalTime heureDepart;
    private LocalTime heureArrivee;
    private String joursSemaine;
    private Long ligneId;
    private Long busId;
}
