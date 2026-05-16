package ma.andl.dto.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LigneResponse {
    private Long id;
    private String nom;
    private String description;
    private List<ArretResponse> arrets;
}
