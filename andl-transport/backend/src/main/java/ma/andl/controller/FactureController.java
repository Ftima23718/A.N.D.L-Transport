package ma.andl.controller;

import ma.andl.dto.request.FactureRequest;
import ma.andl.dto.response.FactureResponse;
import ma.andl.model.entity.Facture;
import ma.andl.model.enums.StatutFacture;
import ma.andl.service.FactureService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "*")
public class FactureController {

    private final FactureService factureService;

    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FactureResponse>> getAllFactures() {
        return ResponseEntity.ok(factureService.getAllFactures());
    }

    @GetMapping("/paginated")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<FactureResponse>> getFacturesPaginated(Pageable pageable) {
        return ResponseEntity.ok(factureService.getFacturesPaginated(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FactureResponse> getFactureById(@PathVariable Long id) {
        return factureService.getFactureById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/etudiant/{etudiantId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ETUDIANT')")
    public ResponseEntity<List<FactureResponse>> getFacturesByEtudiant(@PathVariable Long etudiantId) {
        return ResponseEntity.ok(factureService.getFacturesByEtudiant(etudiantId));
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FactureResponse>> getFacturesByStatut(@PathVariable StatutFacture statut) {
        return ResponseEntity.ok(factureService.getFacturesByStatut(statut));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Facture> createFacture(@RequestBody FactureRequest request) {
        try {
            Facture facture = factureService.createFacture(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(facture);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Facture> updateFacture(@PathVariable Long id, @RequestBody FactureRequest request) {
        try {
            Facture facture = factureService.updateFacture(id, request);
            return ResponseEntity.ok(facture);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/emettre")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Facture> emetFacture(@PathVariable Long id) {
        try {
            Facture facture = factureService.emetFacture(id);
            return ResponseEntity.ok(facture);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/payer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Facture> payerFacture(@PathVariable Long id, @RequestParam Double montant) {
        try {
            Facture facture = factureService.payerFacture(id, montant);
            return ResponseEntity.ok(facture);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/annuler")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Facture> annulerFacture(@PathVariable Long id) {
        try {
            Facture facture = factureService.annulerFacture(id);
            return ResponseEntity.ok(facture);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        try {
            factureService.deleteFacture(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
