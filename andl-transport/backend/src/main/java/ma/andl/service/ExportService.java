package ma.andl.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import ma.andl.model.entity.Inscription;
import ma.andl.model.entity.Paiement;
import ma.andl.repository.InscriptionRepository;
import ma.andl.repository.PaiementRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExportService {

    private final InscriptionRepository inscriptionRepository;
    private final PaiementRepository paiementRepository;

    public ExportService(InscriptionRepository inscriptionRepository, PaiementRepository paiementRepository) {
        this.inscriptionRepository = inscriptionRepository;
        this.paiementRepository = paiementRepository;
    }

    public ByteArrayInputStream exportInscriptionsToExcel() throws IOException {
        List<Inscription> inscriptions = inscriptionRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Inscriptions");

            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Étudiant", "Ligne", "Type Abonnement", "Statut", "Date Inscription"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }

            int rowIdx = 1;
            for (Inscription ins : inscriptions) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(ins.getId());
                row.createCell(1).setCellValue(ins.getEtudiant().getNom() + " " + ins.getEtudiant().getPrenom());
                // Ligne may be null — handle gracefully
                row.createCell(2).setCellValue(ins.getLigne() != null ? ins.getLigne().getNom() : "");
                row.createCell(3).setCellValue(ins.getTypeAbonnement().name());
                row.createCell(4).setCellValue(ins.getStatut().name());
                row.createCell(5).setCellValue(ins.getDateCreation() != null ? ins.getDateCreation().toLocalDate().toString() : "");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream exportInscriptionsToPdf() throws DocumentException {
        List<Inscription> inscriptions = inscriptionRepository.findAll();
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        com.itextpdf.text.Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK);
        Paragraph para = new Paragraph("Liste des Inscriptions", font);
        para.setAlignment(Element.ALIGN_CENTER);
        document.add(para);
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(5);
        String[] headers = {"ID", "Étudiant", "Ligne", "Abonnement", "Statut", "Date"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);
        }

        for (Inscription ins : inscriptions) {
            table.addCell(ins.getId().toString());
            table.addCell(ins.getEtudiant().getNom() + " " + ins.getEtudiant().getPrenom());
            table.addCell(ins.getLigne() != null ? ins.getLigne().getNom() : "");
            table.addCell(ins.getTypeAbonnement().name());
            table.addCell(ins.getStatut().name());
        }

        document.add(table);
        document.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream exportPaiementsToExcel() throws IOException {
        List<Paiement> paiements = paiementRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Paiements");

            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Étudiant", "Montant", "Méthode", "Statut", "Date"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }

            int rowIdx = 1;
            for (Paiement p : paiements) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getId());
                row.createCell(1).setCellValue(p.getInscription().getEtudiant().getNom() + " " + p.getInscription().getEtudiant().getPrenom());
                row.createCell(2).setCellValue(p.getMontant());
                row.createCell(3).setCellValue(p.getMethodePaiement() != null ? p.getMethodePaiement() : "");
                row.createCell(4).setCellValue(p.getStatut().name());
                row.createCell(5).setCellValue(p.getDatePaiement() != null ? p.getDatePaiement().toString() : "");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream exportPaiementsToPdf() throws DocumentException {
        List<Paiement> paiements = paiementRepository.findAll();
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();

        com.itextpdf.text.Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, BaseColor.BLACK);
        Paragraph para = new Paragraph("Liste des Paiements", font);
        para.setAlignment(Element.ALIGN_CENTER);
        document.add(para);
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(5);
        String[] headers = {"ID", "Étudiant", "Montant", "Méthode", "Date"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            table.addCell(cell);
        }

        for (Paiement p : paiements) {
            table.addCell(p.getId() != null ? p.getId().toString() : "");
            table.addCell(p.getInscription() != null && p.getInscription().getEtudiant() != null ? 
                p.getInscription().getEtudiant().getNom() + " " + p.getInscription().getEtudiant().getPrenom() : "");
            table.addCell(p.getMontant() != null ? p.getMontant().toString() + " DH" : "");
            table.addCell(p.getMethodePaiement() != null ? p.getMethodePaiement() : "");
            table.addCell(p.getDatePaiement() != null ? p.getDatePaiement().toString() : "");
        }

        document.add(table);
        document.close();

        return new ByteArrayInputStream(out.toByteArray());
    }
}
