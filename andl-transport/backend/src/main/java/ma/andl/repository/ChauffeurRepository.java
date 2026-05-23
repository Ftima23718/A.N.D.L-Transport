package ma.andl.repository;

import ma.andl.model.entity.Chauffeur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChauffeurRepository extends JpaRepository<Chauffeur, Long> {

    // Rechercher un chauffeur par email
    Optional<Chauffeur> findByEmail(String email);

    // Récupérer les chauffeurs actifs
    List<Chauffeur> findByActifTrue();

    // Vérifier si un email existe
    boolean existsByEmail(String email);

    // Compter les chauffeurs actifs
    long countByActifTrue();

    // Récupérer les chauffeurs sans bus assigné
    @Query("SELECT c FROM Chauffeur c WHERE c.actif = true AND c.id NOT IN (SELECT DISTINCT b.chauffeur.id FROM Bus b WHERE b.chauffeur IS NOT NULL)")
    List<Chauffeur> findChauffeursWithoutBus();

    // Récupérer les chauffeurs par numéro de permis
    Optional<Chauffeur> findByNumeroPermis(String numeroPermis);
}