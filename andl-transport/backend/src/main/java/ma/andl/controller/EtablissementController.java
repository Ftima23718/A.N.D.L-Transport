package ma.andl.controller;

import ma.andl.model.entity.Etablissement;
import ma.andl.service.EtablissementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etablissements")
public class EtablissementController {

    private final EtablissementService etablissementService;

    public EtablissementController(EtablissementService etablissementService) {
        this.etablissementService = etablissementService;
    }

    @GetMapping
    public ResponseEntity<List<Etablissement>> getAll() {
        return ResponseEntity.ok(etablissementService.getAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Etablissement> save(@RequestBody Etablissement etablissement) {
        return ResponseEntity.ok(etablissementService.save(etablissement));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        etablissementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
