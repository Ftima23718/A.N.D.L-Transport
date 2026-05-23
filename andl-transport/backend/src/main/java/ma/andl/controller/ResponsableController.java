package ma.andl.controller;

import ma.andl.dto.response.ResponsableStatsResponse;
import ma.andl.service.ResponsableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/responsable")
@PreAuthorize("hasRole('RESPONSABLE')")
public class ResponsableController {

    private final ResponsableService responsableService;

    public ResponsableController(ResponsableService responsableService) {
        this.responsableService = responsableService;
    }

    /**
     * GET /api/responsable/stats
     * Statistiques pour le responsable: lignes actives, bus, chauffeurs, etc.
     */
    @GetMapping("/stats")
    public ResponseEntity<ResponsableStatsResponse> getStats() {
        return ResponseEntity.ok(responsableService.getStats());
    }

    /**
     * GET /api/responsable/lignes-avec-nombre-rekab
     * Lignes avec le nombre d'étudiants par ligne
     */
    @GetMapping("/lignes-avec-nombre-rekab")
    public ResponseEntity<?> getLignesAvecNombreRekab() {
        return ResponseEntity.ok(responsableService.getLignesAvecNombreEtudiants());
    }
}