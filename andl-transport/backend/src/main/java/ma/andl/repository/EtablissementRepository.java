package ma.andl.repository;

import ma.andl.model.entity.Etablissement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EtablissementRepository extends JpaRepository<Etablissement, Long> {
    Optional<Etablissement> findByNom(String nom);
    List<Etablissement> findByVille(String ville);
    List<Etablissement> findByNiveauScolaire(String niveauScolaire);
    List<Etablissement> findByActifTrue();
}
