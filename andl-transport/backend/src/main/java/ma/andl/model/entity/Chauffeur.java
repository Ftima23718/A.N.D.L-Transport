package ma.andl.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "chauffeurs")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Chauffeur extends Utilisateur {

    @Column(nullable = false, length = 50)
    private String numeroPermis;

    private String dateObtentionPermis;

    private String dateExpirationPermis;

    @OneToMany(mappedBy = "chauffeur", cascade = CascadeType.ALL)
    private List<Bus> busAffectes;
}
