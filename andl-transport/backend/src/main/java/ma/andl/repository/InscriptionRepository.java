package ma.andl.repository;

import ma.andl.model.entity.Inscription;
import ma.andl.model.enums.StatutInscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription, Long> {

    // Récupérer les inscriptions par email de l'étudiant
    List<Inscription> findByEtudiantEmail(String email);

    // Récupérer les inscriptions paginées par statut
    Page<Inscription> findByStatut(StatutInscription statut, Pageable pageable);

    // Compter les inscriptions par statut
    long countByStatut(StatutInscription statut);

    // Récupérer toutes les inscriptions par statut (sans pagination)
    List<Inscription> findByStatut(StatutInscription statut);

    // Récupérer les inscriptions par ligne et statut
    List<Inscription> findByLigneIdAndStatut(Long ligneId, StatutInscription statut);

    // Compter les inscriptions par ligne et statut
    long countByLigneIdAndStatut(Long ligneId, StatutInscription statut);

    // Récupérer les inscriptions validées par étudiant
    List<Inscription> findByEtudiantIdAndStatut(Long etudiantId, StatutInscription statut);

    // Récupérer les inscriptions par date de création
    List<Inscription> findByDateCreationBetween(LocalDateTime debut, LocalDateTime fin);

    // Compter les inscriptions par ligne (tous statuts)
    @Query("SELECT i.ligne.id, COUNT(i) FROM Inscription i WHERE i.ligne IS NOT NULL GROUP BY i.ligne.id")
    List<Object[]> countInscriptionsByLigne();

    // Récupérer les inscriptions avec badge actif
    @Query("SELECT i FROM Inscription i WHERE i.badge IS NOT NULL AND i.badge.estValide = true AND i.statut = 'VALIDEE'")
    List<Inscription> findActiveInscriptionsWithBadge();

    // Récupérer les inscriptions par étudiant avec pagination
    Page<Inscription> findByEtudiantId(Long etudiantId, Pageable pageable);
}