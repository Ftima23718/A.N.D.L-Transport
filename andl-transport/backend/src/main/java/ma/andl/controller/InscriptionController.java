package ma.andl.controller;

import jakarta.validation.Valid;
import ma.andl.dto.request.InscriptionRequest;
import ma.andl.dto.response.InscriptionResponse;
import ma.andl.service.InscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inscriptions")
public class InscriptionController {

    private final InscriptionService inscriptionService;

    public InscriptionController(InscriptionService inscriptionService) {
        this.inscriptionService = inscriptionService;
    }

    @PostMapping("/soumettre")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<InscriptionResponse> soumettre(@Valid @RequestBody InscriptionRequest request, Authentication authentication) {
        return ResponseEntity.ok(inscriptionService.soumettre(request, authentication.getName()));
    }

    @GetMapping("/ma-liste")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<List<InscriptionResponse>> getMesInscriptions(Authentication authentication) {
        return ResponseEntity.ok(inscriptionService.getMesInscriptions(authentication.getName()));
    }
    // ma/andl/controller/InscriptionController.java - Ajouter cette méthode
    @GetMapping("/mon-itineraire")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<ItineraireResponse> getMonItineraire(Authentication authentication) {
        return ResponseEntity.ok(inscriptionService.getMonItineraire(authentication.getName()));
    }
}
