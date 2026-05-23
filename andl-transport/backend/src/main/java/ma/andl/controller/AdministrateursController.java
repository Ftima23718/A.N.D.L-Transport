package ma.andl.controller;

import ma.andl.model.entity.Administrateur;
import ma.andl.model.enums.Role;
import ma.andl.repository.AdministrateurRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/administrateurs")
@CrossOrigin(origins = "*")
public class AdministrateursController {

    private final AdministrateurRepository administrateurRepository;
    private final PasswordEncoder passwordEncoder;

    public AdministrateursController(AdministrateurRepository administrateurRepository,
                                    PasswordEncoder passwordEncoder) {
        this.administrateurRepository = administrateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllAdmins() {
        List<Map<String, Object>> admins = administrateurRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(admins);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminById(@PathVariable Long id) {
        return administrateurRepository.findById(id)
                .map(admin -> ResponseEntity.ok(mapToResponse(admin)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createAdmin(@RequestBody Map<String, String> request) {
        try {
            if (administrateurRepository.findByEmail(request.get("email")).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }

            String password = request.getOrDefault("motDePasse", "Password@123");
            
            Administrateur admin = Administrateur.builder()
                    .nom(request.get("nom"))
                    .prenom(request.get("prenom"))
                    .email(request.get("email"))
                    .telephone(request.get("telephone"))
                    .motDePasse(passwordEncoder.encode(password))
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();

            Administrateur saved = administrateurRepository.save(admin);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateAdmin(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Administrateur admin = administrateurRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            if (request.containsKey("nom")) {
                admin.setNom((String) request.get("nom"));
            }
            if (request.containsKey("prenom")) {
                admin.setPrenom((String) request.get("prenom"));
            }
            if (request.containsKey("telephone")) {
                admin.setTelephone((String) request.get("telephone"));
            }
            if (request.containsKey("actif")) {
                admin.setActif((Boolean) request.get("actif"));
            }

            Administrateur updated = administrateurRepository.save(admin);
            return ResponseEntity.ok(mapToResponse(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            Administrateur admin = administrateurRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Admin not found"));

            String newPassword = request.get("newPassword");
            if (newPassword == null || newPassword.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
            }

            admin.setMotDePasse(passwordEncoder.encode(newPassword));
            administrateurRepository.save(admin);
            
            return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        try {
            administrateurRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Map<String, Object> mapToResponse(Administrateur admin) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", admin.getId());
        response.put("nom", admin.getNom());
        response.put("prenom", admin.getPrenom());
        response.put("email", admin.getEmail());
        response.put("telephone", admin.getTelephone());
        response.put("role", admin.getRole().name());
        response.put("actif", admin.isActif());
        response.put("dateCreation", admin.getDateCreation());
        return response;
    }
}
