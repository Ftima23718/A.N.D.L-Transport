package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "etablissements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Etablissement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    private String adresse;

    private String ville;

    private String telephone;

    @Builder.Default
    private boolean actif = true;

    @OneToMany(mappedBy = "etablissement")
    private List<Etudiant> etudiants;
}
