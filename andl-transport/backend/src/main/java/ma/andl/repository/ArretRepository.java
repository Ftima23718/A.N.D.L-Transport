package ma.andl.repository;

import ma.andl.model.entity.Arret;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArretRepository extends JpaRepository<Arret, Long> {
    List<Arret> findByLigneId(Long ligneId);
}
