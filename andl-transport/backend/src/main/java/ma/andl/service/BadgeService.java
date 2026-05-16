package ma.andl.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import ma.andl.dto.response.BadgeResponse;
import ma.andl.model.entity.Badge;
import ma.andl.model.entity.Etudiant;
import ma.andl.model.entity.Inscription;
import ma.andl.repository.BadgeRepository;
import ma.andl.repository.InscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Base64;
import java.util.UUID;

@Service
public class BadgeService {

    private final BadgeRepository badgeRepository;
    private final InscriptionRepository inscriptionRepository;

    public BadgeService(BadgeRepository badgeRepository, InscriptionRepository inscriptionRepository) {
        this.badgeRepository = badgeRepository;
        this.inscriptionRepository = inscriptionRepository;
    }

    @Transactional
    public Badge generateBadge(Long inscriptionId) {
        Inscription inscription = inscriptionRepository.findById(inscriptionId)
                .orElseThrow(() -> new RuntimeException("Inscription non trouvée"));

        String qrContent = UUID.randomUUID().toString();
        
        // Date d'expiration fixe au 30 juin de l'année scolaire en cours
        int currentYear = LocalDate.now().getYear();
        LocalDate expiryDate = LocalDate.of(currentYear + (LocalDate.now().getMonthValue() > 6 ? 1 : 0), 6, 30);

        String qrCodeBase64 = generateQRCodeImage(qrContent);

        Badge badge = Badge.builder()
                .codeQr(qrContent)
                .dateExpiration(expiryDate)
                .estValide(true)
                .qrCodeBase64(qrCodeBase64)
                .inscription(inscription)
                .build();

        return badgeRepository.save(badge);
    }

    public BadgeResponse getBadgeByInscriptionId(Long id) {
        Badge badge = badgeRepository.findByInscriptionId(id)
                .orElseThrow(() -> new RuntimeException("Badge non trouvé"));
        return mapToResponse(badge);
    }

    private String generateQRCodeImage(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 250, 250);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] pngData = pngOutputStream.toByteArray();
            return Base64.getEncoder().encodeToString(pngData);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du QR Code", e);
        }
    }

    private BadgeResponse mapToResponse(Badge b) {
        Inscription i = b.getInscription();
        Etudiant e = i.getEtudiant();
        return BadgeResponse.builder()
                .id(b.getId())
                .codeQr(b.getCodeQr())
                .dateExpiration(b.getDateExpiration())
                .estValide(b.isEstValide())
                .qrCodeBase64(b.getQrCodeBase64())
                .numeroEtudiant(e.getNumeroEtudiant())
                .etudiantNom(e.getNom())
                .etudiantPrenom(e.getPrenom())
                .etablissement(e.getEtablissement() != null ? e.getEtablissement().getNom() : "Non spécifié")
                .niveauScolaire(e.getNiveauScolaire())
                .anneeScolaire(e.getAnneeScolaire())
                .dateNaissance(e.getDateNaissance())
                .ligneNom(i.getLigne() != null ? i.getLigne().getNom() : null)
                .build();
    }
}
