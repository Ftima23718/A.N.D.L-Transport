package ma.andl.repository;

import ma.andl.model.entity.Etudiant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EtudiantRepository extends JpaRepository<Etudiant, Long> {
    Optional<Etudiant> findByEmail(String email);
    Optional<Etudiant> findByNumeroEtudiant(String numeroEtudiant);
    boolean existsByEmail(String email);
    boolean existsByNumeroEtudiant(String numeroEtudiant);

    @Query("SELECT e FROM Etudiant e WHERE " +
           "LOWER(e.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.prenom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.numeroEtudiant) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Etudiant> search(@Param("keyword") String keyword, Pageable pageable);
}
