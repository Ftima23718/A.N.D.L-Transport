package ma.andl.controller;

import jakarta.validation.Valid;
import ma.andl.dto.request.LoginRequest;
import ma.andl.dto.request.RegisterRequest;
import ma.andl.dto.response.AuthResponse;
import ma.andl.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Tentative de connexion pour : {}", request.getEmail());
        try {
            AuthResponse response = authService.login(request);
            log.info("Connexion réussie pour : {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Échec de connexion pour {} : {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }
}
