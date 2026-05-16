package ma.andl.service;

import lombok.extern.slf4j.Slf4j;
import ma.andl.dto.request.LoginRequest;
import ma.andl.dto.request.RegisterRequest;
import ma.andl.dto.response.AuthResponse;
import ma.andl.model.entity.Etudiant;
import ma.andl.model.entity.Utilisateur;
import ma.andl.model.enums.Role;
import ma.andl.repository.EtudiantRepository;
import ma.andl.repository.UtilisateurRepository;
import ma.andl.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final EtudiantRepository etudiantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UtilisateurRepository utilisateurRepository,
                       EtudiantRepository etudiantRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       AuthenticationManager authenticationManager) {
        this.utilisateurRepository = utilisateurRepository;
        this.etudiantRepository = etudiantRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Début inscription pour : {}", request.getEmail());

        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            log.error("L'email {} est déjà utilisé", request.getEmail());
            throw new RuntimeException("Email déjà utilisé");
        }

        try {
            String numeroEtudiant = "A" + String.format("%05d", etudiantRepository.count() + 1);
            log.debug("Génération numéro étudiant : {}", numeroEtudiant);

            Etudiant etudiant = Etudiant.builder()
                    .nom(request.getNom())
                    .prenom(request.getPrenom())
                    .email(request.getEmail())
                    .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                    .telephone(request.getTelephone())
                    .role(Role.ETUDIANT)
                    .dateNaissance(request.getDateNaissance())
                    .niveauScolaire(request.getNiveauScolaire())
                    .anneeScolaire(request.getAnneeScolaire())
                    .numeroEtudiant(numeroEtudiant)
                    .actif(true)
                    .build();

            Etudiant saved = etudiantRepository.save(etudiant);
            log.info("Étudiant enregistré avec ID : {}", saved.getId());

            String token = jwtTokenProvider.generateToken(saved);
            return AuthResponse.builder()
                    .token(token)
                    .email(saved.getEmail())
                    .role(saved.getRole().name())
                    .nom(saved.getNom())
                    .prenom(saved.getPrenom())
                    .build();

        } catch (Exception e) {
            log.error("Erreur lors de la création de l'étudiant : {}", e.getMessage(), e);
            throw e;
        }
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Tentative de login pour : {}", request.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
            );

            Utilisateur utilisateur = (Utilisateur) authentication.getPrincipal();
            log.info("Authentification réussie pour : {}, rôle : {}", utilisateur.getEmail(), utilisateur.getRole());

            String token = jwtTokenProvider.generateToken(utilisateur);

            return AuthResponse.builder()
                    .token(token)
                    .email(utilisateur.getEmail())
                    .role(utilisateur.getRole().name())
                    .nom(utilisateur.getNom())
                    .prenom(utilisateur.getPrenom())
                    .build();

        } catch (Exception e) {
            log.error("Erreur d'authentification pour {} : {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }
}
