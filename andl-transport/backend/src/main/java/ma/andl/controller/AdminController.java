package ma.andl.controller;

import ma.andl.dto.response.EtudiantResponse;
import ma.andl.dto.response.InscriptionResponse;
import ma.andl.dto.response.StatsResponse;
import ma.andl.service.AdminService;
import ma.andl.service.EtudiantService;
import ma.andl.service.InscriptionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final EtudiantService etudiantService;
    private final InscriptionService inscriptionService;

    public AdminController(AdminService adminService, 
                           EtudiantService etudiantService, 
                           InscriptionService inscriptionService) {
        this.adminService = adminService;
        this.etudiantService = etudiantService;
        this.inscriptionService = inscriptionService;
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/etudiants")
    public ResponseEntity<Page<EtudiantResponse>> getAllEtudiants(Pageable pageable) {
        return ResponseEntity.ok(etudiantService.getAll(pageable));
    }

    @GetMapping("/etudiants/search")
    public ResponseEntity<Page<EtudiantResponse>> searchEtudiants(@RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(etudiantService.search(keyword, pageable));
    }

    @GetMapping("/etudiants/{id}")
    public ResponseEntity<EtudiantResponse> getEtudiantById(@PathVariable Long id) {
        return ResponseEntity.ok(etudiantService.getById(id));
    }

    @PutMapping("/etudiants/{id}")
    public ResponseEntity<Void> updateEtudiant(@PathVariable Long id, @RequestBody ma.andl.dto.request.EtudiantUpdateRequest request) {
        etudiantService.update(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inscriptions")
    public ResponseEntity<Page<InscriptionResponse>> getAllInscriptions(Pageable pageable) {
        return ResponseEntity.ok(inscriptionService.getAll(pageable));
    }

    @PatchMapping("/inscriptions/{id}/valider")
    public ResponseEntity<Void> validerInscription(@PathVariable Long id) {
        inscriptionService.valider(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/inscriptions/{id}/rejeter")
    public ResponseEntity<Void> rejeterInscription(@PathVariable Long id, @RequestBody String motif) {
        inscriptionService.rejeter(id, motif);
        return ResponseEntity.ok().build();
    }
}
