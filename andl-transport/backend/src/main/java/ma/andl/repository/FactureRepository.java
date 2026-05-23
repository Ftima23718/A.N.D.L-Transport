package ma.andl.repository;

import ma.andl.model.entity.Facture;
import ma.andl.model.enums.StatutFacture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByNumero(String numero);
    Page<Facture> findByEtudiantId(Long etudiantId, Pageable pageable);
    List<Facture> findByStatut(StatutFacture statut);
    List<Facture> findByDateEmissionBetween(LocalDate debut, LocalDate fin);
    List<Facture> findByInscriptionId(Long inscriptionId);
}
