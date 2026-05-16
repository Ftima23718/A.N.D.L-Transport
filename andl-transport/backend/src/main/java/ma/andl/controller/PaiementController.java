package ma.andl.controller;

import ma.andl.dto.request.PaiementRequest;
import ma.andl.dto.response.PaiementResponse;
import ma.andl.service.PaiementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
public class PaiementController {

    private final PaiementService paiementService;

    public PaiementController(PaiementService paiementService) {
        this.paiementService = paiementService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> enregistrer(@RequestBody PaiementRequest request) {
        paiementService.enregistrerPaiement(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaiementResponse>> getAll() {
        return ResponseEntity.ok(paiementService.getAll());
    }

    @PatchMapping("/{id}/valider")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> valider(@PathVariable Long id) {
        paiementService.validerPaiement(id);
        return ResponseEntity.ok().build();
    }
}
