package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "etudiants")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Etudiant extends Utilisateur {

    @Column(nullable = false, unique = true)
    private String numeroEtudiant;

    @Column(nullable = false)
    private LocalDate dateNaissance;

    private String filiere;

    private String niveauScolaire;

    private String anneeScolaire;

    private String photoUrl;

    private String carteEtudiantUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etablissement_id")
    private Etablissement etablissement;

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Inscription> inscriptions;
}
