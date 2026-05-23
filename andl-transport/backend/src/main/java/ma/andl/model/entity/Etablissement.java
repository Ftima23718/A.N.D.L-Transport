package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
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

    private String responsable;

    private String niveauScolaire; // Primaire, Collège, Lycée

    private Double latitude;

    private Double longitude;

    @Builder.Default
    private boolean actif = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime dateCreation;

    @UpdateTimestamp
    private LocalDateTime dateModification;

    @OneToMany(mappedBy = "etablissement")
    private List<Etudiant> etudiants;

    @OneToMany(mappedBy = "etablissement")
    private List<Bus> bus;

    public int getNombreEtudiants() {
        return etudiants != null ? etudiants.size() : 0;
    }

    public int getNombreTransports() {
        return bus != null ? bus.size() : 0;
    }
}
