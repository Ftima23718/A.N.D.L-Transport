package ma.andl.controller;

import ma.andl.dto.response.ChauffeurProgrammeResponse;
import ma.andl.dto.response.EtudiantRekabResponse;
import ma.andl.service.ChauffeurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chauffeur")
@PreAuthorize("hasRole('CHAUFFEUR')")
public class ChauffeurController {

    private final ChauffeurService chauffeurService;

    public ChauffeurController(ChauffeurService chauffeurService) {
        this.chauffeurService = chauffeurService;
    }

    /**
     * GET /api/chauffeur/mon-programme
     * Récupère les trajets du chauffeur connecté pour aujourd'hui ou la semaine
     */
    @GetMapping("/mon-programme")
    public ResponseEntity<List<ChauffeurProgrammeResponse>> getMonProgramme(
            @RequestParam(required = false) String jour,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(chauffeurService.getProgrammeByChauffeur(email, jour));
    }

    /**
     * GET /api/chauffeur/mes-rekab
     * Récupère la liste des étudiants sur la ligne du chauffeur
     */
    @GetMapping("/mes-rekab")
    public ResponseEntity<List<EtudiantRekabResponse>> getMesRekab(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(chauffeurService.getEtudiantsByChauffeur(email));
    }

    /**
     * GET /api/chauffeur/ligne
     * Récupère la ligne assignée au chauffeur
     */
    @GetMapping("/ligne")
    public ResponseEntity<?> getLigneAssignee(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(chauffeurService.getLigneByChauffeur(email));
    }
}