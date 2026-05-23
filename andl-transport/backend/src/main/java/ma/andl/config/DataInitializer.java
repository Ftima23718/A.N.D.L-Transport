package ma.andl.config;

import ma.andl.model.entity.Administrateur;
import ma.andl.model.entity.Etablissement;
import ma.andl.model.entity.Tarif;
import ma.andl.model.enums.Role;
import ma.andl.model.enums.TypeAbonnement;
import ma.andl.repository.AdministrateurRepository;
import ma.andl.repository.EtablissementRepository;
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
    private final EtablissementRepository etablissementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UtilisateurRepository utilisateurRepository,
                           AdministrateurRepository administrateurRepository,
                           TarifRepository tarifRepository,
                           EtablissementRepository etablissementRepository,
                           PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.administrateurRepository = administrateurRepository;
        this.tarifRepository = tarifRepository;
        this.etablissementRepository = etablissementRepository;
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
                    .montant(100.0)
                    .description("Abonnement mensuel de transport")
                    .actif(true)
                    .build());
            
            tarifRepository.save(Tarif.builder()
                    .typeAbonnement(TypeAbonnement.TRIMESTRIEL)
                    .montant(280.0)
                    .description("Abonnement trimestriel")
                    .actif(true)
                    .build());
            
            tarifRepository.save(Tarif.builder()
                    .typeAbonnement(TypeAbonnement.SEMESTRIEL)
                    .montant(550.0)
                    .description("Abonnement semestriel")
                    .actif(true)
                    .build());
            
            tarifRepository.save(Tarif.builder()
                    .typeAbonnement(TypeAbonnement.ANNUEL)
                    .montant(1000.0)
                    .description("Abonnement annuel (meilleure offre)")
                    .actif(true)
                    .build());
            
            System.out.println("DEFAULT TARIFS CREATED");
        }

        // 3. Créer les établissements par défaut
        if (etablissementRepository.count() == 0) {
            System.out.println("CREATING DEFAULT ESTABLISHMENTS");
            
            etablissementRepository.save(Etablissement.builder()
                    .nom("Madrasat A9odad")
                    .adresse("Rue Principale, Quartier Centre")
                    .ville("Casablanca")
                    .telephone("+212 5 22 XX XX XX")
                    .responsable("M. Hassan Alaoui")
                    .niveauScolaire("Primaire")
                    .latitude(33.5731)
                    .longitude(-7.5898)
                    .actif(true)
                    .build());
            
            etablissementRepository.save(Etablissement.builder()
                    .nom("Madrasat A9odad - Collège")
                    .adresse("Avenue Mohammed V, Quartier Gauthier")
                    .ville("Casablanca")
                    .telephone("+212 5 22 XX XX XX")
                    .responsable("Mme Fatima Bennani")
                    .niveauScolaire("Collège")
                    .latitude(33.5731)
                    .longitude(-7.5898)
                    .actif(true)
                    .build());
            
            etablissementRepository.save(Etablissement.builder()
                    .nom("Najah I3dadi")
                    .adresse("Boulevard Zerktouni, Quartier Ain Chock")
                    .ville("Casablanca")
                    .telephone("+212 5 22 XX XX XX")
                    .responsable("M. Ahmed Bennani")
                    .niveauScolaire("Collège")
                    .latitude(33.5450)
                    .longitude(-7.6100)
                    .actif(true)
                    .build());
            
            etablissementRepository.save(Etablissement.builder()
                    .nom("Ibn Nafis - Lycée")
                    .adresse("Rue Tarik Ibn Ziad, Quartier Ben Msik")
                    .ville("Casablanca")
                    .telephone("+212 5 22 XX XX XX")
                    .responsable("M. Mohamed Idrissi")
                    .niveauScolaire("Lycée")
                    .latitude(33.5200)
                    .longitude(-7.6200)
                    .actif(true)
                    .build());
            
            System.out.println("DEFAULT ESTABLISHMENTS CREATED");
        }
    }
}
