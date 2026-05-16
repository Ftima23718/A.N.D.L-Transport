package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "arrets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Arret {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    private Double latitude;

    private Double longitude;

    private Integer ordre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ligne_id", nullable = false)
    private Ligne ligne;
}
