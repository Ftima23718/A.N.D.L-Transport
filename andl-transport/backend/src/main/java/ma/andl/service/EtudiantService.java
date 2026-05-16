package ma.andl.service;

import ma.andl.dto.response.EtudiantResponse;
import ma.andl.model.entity.Etudiant;
import ma.andl.repository.EtudiantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EtudiantService {

    private final EtudiantRepository etudiantRepository;

    public EtudiantService(EtudiantRepository etudiantRepository) {
        this.etudiantRepository = etudiantRepository;
    }

    public Page<EtudiantResponse> getAll(Pageable pageable) {
        return etudiantRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<EtudiantResponse> search(String keyword, Pageable pageable) {
        return etudiantRepository.search(keyword, pageable).map(this::mapToResponse);
    }

    public EtudiantResponse getById(Long id) {
        return etudiantRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
    }

    @Transactional
    public void delete(Long id) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        etudiant.setActif(false);
        etudiantRepository.save(etudiant);
    }

    private EtudiantResponse mapToResponse(Etudiant e) {
        return EtudiantResponse.builder()
                .id(e.getId())
                .nom(e.getNom())
                .prenom(e.getPrenom())
                .email(e.getEmail())
                .role(e.getRole().name())
                .telephone(e.getTelephone())
                .actif(e.isActif())
                .numeroEtudiant(e.getNumeroEtudiant())
                .dateNaissance(e.getDateNaissance())
                .etablissementNom(e.getEtablissement() != null ? e.getEtablissement().getNom() : null)
                .niveauScolaire(e.getNiveauScolaire())
                .anneeScolaire(e.getAnneeScolaire())
                .photoUrl(e.getPhotoUrl())
                .build();
    }
}
