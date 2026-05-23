// ma/andl/service/BadgeService.java - Ajouter/modifier cette méthode
private BadgeResponse mapToResponse(Badge badge) {
    Inscription inscription = badge.getInscription();
    Etudiant etudiant = inscription.getEtudiant();
    Ligne ligne = inscription.getLigne();

    return BadgeResponse.builder()
            .id(badge.getId())
            .codeQr(badge.getCodeQr())
            .dateExpiration(badge.getDateExpiration())
            .estValide(badge.isEstValide())
            .qrCodeBase64(badge.getQrCodeBase64())
            .numeroEtudiant(etudiant.getNumeroEtudiant())
            .etudiantNom(etudiant.getNom())
            .etudiantPrenom(etudiant.getPrenom())
            .etablissement(etudiant.getEtablissement() != null ? etudiant.getEtablissement().getNom() : "Non défini")
            .niveauScolaire(etudiant.getNiveauScolaire())
            .anneeScolaire(etudiant.getAnneeScolaire())
            .dateNaissance(etudiant.getDateNaissance())
            .ligneNom(ligne != null ? ligne.getNom() : "Non défini")
            .photoUrl(etudiant.getPhotoUrl())
            .telephone(etudiant.getTelephone())
            .build();
}