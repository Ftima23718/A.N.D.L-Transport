package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "lignes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ligne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    private String description;

    @OneToMany(mappedBy = "ligne", cascade = CascadeType.ALL)
    private List<Arret> arrets;

    @OneToMany(mappedBy = "ligne")
    private List<Trajet> trajets;
}
