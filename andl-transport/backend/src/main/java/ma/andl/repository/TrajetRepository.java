package ma.andl.repository;

import ma.andl.model.entity.Trajet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrajetRepository extends JpaRepository<Trajet, Long> {

    // Récupérer les trajets par ligne
    List<Trajet> findByLigneId(Long ligneId);

    // Récupérer les trajets par chauffeur
    List<Trajet> findByChauffeurId(Long chauffeurId);

    // Récupérer les trajets par chauffeur et jour de semaine (ex: "LUNDI", "MARDI", etc.)
    List<Trajet> findByChauffeurIdAndJoursSemaineContaining(Long chauffeurId, String jour);

    // Récupérer les trajets par bus
    List<Trajet> findByBusId(Long busId);

    // Récupérer les trajets par ligne et jour
    List<Trajet> findByLigneIdAndJoursSemaineContaining(Long ligneId, String jour);
}