package ma.andl.repository;

import ma.andl.model.entity.Bus;
import ma.andl.model.enums.StatutBus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {

    // Rechercher un bus par matricule
    Optional<Bus> findByMatricule(String matricule);

    // Récupérer les bus par établissement
    List<Bus> findByEtablissementId(Long etablissementId);

    // Récupérer les bus par chauffeur
    List<Bus> findByChauffeurId(Long chauffeurId);

    // Compter les bus par statut
    long countByStatut(StatutBus statut);

    // Récupérer les bus actifs
    List<Bus> findByStatut(StatutBus statut);

    // Récupérer les bus par établissement et statut
    List<Bus> findByEtablissementIdAndStatut(Long etablissementId, StatutBus statut);

    // Récupérer les bus sans chauffeur assigné
    @Query("SELECT b FROM Bus b WHERE b.chauffeur IS NULL AND b.statut = 'ACTIF'")
    List<Bus> findBusWithoutChauffeur();

    // Récupérer le bus d'une ligne via les trajets
    @Query("SELECT DISTINCT t.bus FROM Trajet t WHERE t.ligne.id = :ligneId AND t.bus IS NOT NULL")
    List<Bus> findBusByLigneId(Long ligneId);
}