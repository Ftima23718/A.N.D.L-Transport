package ma.andl.repository;

import ma.andl.model.entity.Inscription;
import ma.andl.model.enums.StatutInscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {
    List<Inscription> findByEtudiantEmail(String email);
    Page<Inscription> findByStatut(StatutInscription statut, Pageable pageable);
    long countByStatut(StatutInscription statut);
}
