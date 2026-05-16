package ma.andl.service;

import ma.andl.model.entity.Etablissement;
import ma.andl.repository.EtablissementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EtablissementService {

    private final EtablissementRepository etablissementRepository;

    public EtablissementService(EtablissementRepository etablissementRepository) {
        this.etablissementRepository = etablissementRepository;
    }

    public List<Etablissement> getAll() {
        return etablissementRepository.findAll();
    }

    @Transactional
    public Etablissement save(Etablissement etablissement) {
        return etablissementRepository.save(etablissement);
    }

    @Transactional
    public void delete(Long id) {
        etablissementRepository.deleteById(id);
    }
}
