package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.andl.model.enums.TypeAbonnement;

@Entity
@Table(name = "tarifs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tarif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAbonnement typeAbonnement;

    @Column(nullable = false)
    private Double montant;

    private String description;
}
