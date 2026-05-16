package ma.andl.repository;

import ma.andl.model.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Optional<Badge> findByInscriptionId(Long inscriptionId);
    Optional<Badge> findByCodeQr(String codeQr);
}
