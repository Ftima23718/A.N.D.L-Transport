package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.andl.model.enums.StatutInscription;
import ma.andl.model.enums.TypeAbonnement;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutInscription statut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAbonnement typeAbonnement;

    private LocalDate dateDebut;

    private LocalDate dateFin;

    private String motifRejet;

    @CreationTimestamp
    private LocalDateTime dateCreation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ligne_id")
    private Ligne ligne;

    @OneToOne(mappedBy = "inscription", cascade = CascadeType.ALL)
    private Badge badge;

    @OneToOne(mappedBy = "inscription", cascade = CascadeType.ALL)
    private Paiement paiement;
}
