package ma.andl.repository;

import ma.andl.model.entity.Tarif;
import ma.andl.model.enums.TypeAbonnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TarifRepository extends JpaRepository<Tarif, Long> {
    Optional<Tarif> findByTypeAbonnement(TypeAbonnement typeAbonnement);
}
