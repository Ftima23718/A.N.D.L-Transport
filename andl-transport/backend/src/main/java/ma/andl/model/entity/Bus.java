package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.andl.model.enums.StatutBus;

@Entity
@Table(name = "bus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String immatriculation;

    private String modele;
    
    @Column(nullable = false)
    private Integer capacite;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutBus statut;

    public boolean isActif() {
        return StatutBus.ACTIF.equals(this.statut);
    }
}
