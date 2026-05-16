package ma.andl.repository;

import ma.andl.model.entity.Paiement;
import ma.andl.model.enums.StatutPaiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement, Long> {
    List<Paiement> findByInscriptionEtudiantId(Long etudiantId);
    List<Paiement> findByStatut(StatutPaiement statut);
}
