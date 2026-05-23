package ma.andl.repository;

import ma.andl.model.entity.Ligne;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LigneRepository extends JpaRepository<Ligne, Long> {

    // Rechercher une ligne par nom
    Optional<Ligne> findByNom(String nom);

    // Récupérer les lignes actives
    List<Ligne> findByActifTrue();

    // Compter les lignes actives
    long countByActifTrue();

    // Récupérer les lignes avec le nombre d'étudiants inscrits
    @Query("SELECT l, COUNT(i) FROM Ligne l LEFT JOIN Inscription i ON i.ligne = l AND i.statut = 'VALIDEE' GROUP BY l")
    List<Object[]> findLignesAvecNombreEtudiants();
}