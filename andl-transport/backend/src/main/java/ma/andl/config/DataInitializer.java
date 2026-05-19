package ma.andl.config;

import ma.andl.model.entity.Administrateur;
import ma.andl.model.entity.Tarif;
import ma.andl.model.enums.Role;
import ma.andl.model.enums.TypeAbonnement;
import ma.andl.repository.AdministrateurRepository;
import ma.andl.repository.TarifRepository;
import ma.andl.repository.UtilisateurRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final AdministrateurRepository administrateurRepository;
    private final TarifRepository tarifRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                           AdministrateurRepository administrateurRepository,
                           TarifRepository tarifRepository,
                           PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.administrateurRepository = administrateurRepository;
        this.tarifRepository = tarifRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Créer l'admin par défaut
        if (!utilisateurRepository.existsByEmail("admin@andl.ma")) {
            System.out.println("CREATING DEFAULT ADMIN: admin@andl.ma / Admin@2024");
            Administrateur admin = Administrateur.builder()
                    .nom("Administrateur")
                    .prenom("A.N.D.L")
                    .email("admin@andl.ma")
                    .motDePasse(passwordEncoder.encode("Admin@2024"))
                    .role(Role.ADMIN)
                    .actif(true)
                    .build();
            administrateurRepository.save(admin);
            System.out.println("DEFAULT ADMIN CREATED SUCCESSFULLY");
        } else {
            System.out.println("DEFAULT ADMIN ALREADY EXISTS");
        }

        // 2. Créer les tarifs par défaut
        if (tarifRepository.count() == 0) {
            tarifRepository.save(Tarif.builder()
                    .typeAbonnement(TypeAbonnement.MENSUEL)
                    .montant(150.0)
                    .description("Abonnement mensuel de transport")
                    .build());
            
            tarifRepository.save(Tarif.builder()
                    .typeAbonnement(TypeAbonnement.TRIMESTRIEL)
                    .montant(400.0)
                    .description("Abonnement trimestriel (économie de 50 DH)")
                    .build());
            
            tarifRepository.save(Tarif.builder()
                    .typeAbonnement(TypeAbonnement.ANNUEL)
                    .montant(1400.0)
                    .description("Abonnement annuel (économie de 100 DH)")
                    .build());
        }
    }
}
