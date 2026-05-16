package ma.andl.controller;

import ma.andl.dto.response.BadgeResponse;
import ma.andl.service.BadgeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/badges")
public class BadgeController {

    private final BadgeService badgeService;

    public BadgeController(BadgeService badgeService) {
        this.badgeService = badgeService;
    }

    @GetMapping("/inscription/{id}")
    public ResponseEntity<BadgeResponse> getBadgeByInscription(@PathVariable Long id) {
        return ResponseEntity.ok(badgeService.getBadgeByInscriptionId(id));
    }
}
