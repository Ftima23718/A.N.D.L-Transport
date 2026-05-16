package ma.andl.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@andl-transport.ma");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }

    public void sendInscriptionValidation(String to, String nomEtudiant) {
        String subject = "A.N.D.L Transport - Inscription Validée";
        String content = "Bonjour " + nomEtudiant + ",\n\n" +
                "Votre demande d'inscription au service de transport A.N.D.L a été validée.\n" +
                "Veuillez procéder au paiement pour finaliser votre abonnement.\n\n" +
                "Cordialement,\n" +
                "L'équipe A.N.D.L Transport";
        sendEmail(to, subject, content);
    }

    public void sendInscriptionRejet(String to, String nomEtudiant, String motif) {
        String subject = "A.N.D.L Transport - Inscription Refusée";
        String content = "Bonjour " + nomEtudiant + ",\n\n" +
                "Votre demande d'inscription au service de transport A.N.D.L a été refusée pour le motif suivant :\n" +
                "\"" + motif + "\"\n\n" +
                "Vous pouvez soumettre une nouvelle demande après avoir corrigé les éléments indiqués.\n\n" +
                "Cordialement,\n" +
                "L'équipe A.N.D.L Transport";
        sendEmail(to, subject, content);
    }
}
