package ma.andl.service;

import ma.andl.model.entity.Bus;
import ma.andl.model.entity.Ligne;
import ma.andl.model.entity.Tarif;
import ma.andl.repository.BusRepository;
import ma.andl.repository.LigneRepository;
import ma.andl.repository.TarifRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransportAdminService {

    private final LigneRepository ligneRepository;
    private final BusRepository busRepository;
    private final TarifRepository tarifRepository;

    public TransportAdminService(LigneRepository ligneRepository, 
                                BusRepository busRepository, 
                                TarifRepository tarifRepository) {
        this.ligneRepository = ligneRepository;
        this.busRepository = busRepository;
        this.tarifRepository = tarifRepository;
    }

    public List<Ligne> getAllLignes() { return ligneRepository.findAll(); }
    
    @Transactional
    public Ligne saveLigne(Ligne ligne) { return ligneRepository.save(ligne); }

    public List<Bus> getAllBus() { return busRepository.findAll(); }
    
    @Transactional
    public Bus saveBus(Bus bus) { return busRepository.save(bus); }

    public List<Tarif> getAllTarifs() { return tarifRepository.findAll(); }
    
    @Transactional
    public Tarif saveTarif(Tarif tarif) { return tarifRepository.save(tarif); }
}
