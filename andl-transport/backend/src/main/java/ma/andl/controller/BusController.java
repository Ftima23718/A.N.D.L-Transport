package ma.andl.controller;

import ma.andl.dto.request.BusRequest;
import ma.andl.dto.response.BusResponse;
import ma.andl.model.entity.Bus;
import ma.andl.service.BusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bus")
@CrossOrigin(origins = "*")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BusResponse>> getAllBus() {
        return ResponseEntity.ok(busService.getAllBusResponse());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusResponse> getBusById(@PathVariable Long id) {
        BusResponse bus = busService.getBusResponseById(id);
        if (bus != null) {
            return ResponseEntity.ok(bus);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/etablissement/{etablissementId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Bus>> getBusByEtablissement(@PathVariable Long etablissementId) {
        return ResponseEntity.ok(busService.getBusByEtablissement(etablissementId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> createBus(@RequestBody BusRequest request) {
        try {
            Bus bus = busService.createBus(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(bus);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody BusRequest request) {
        try {
            Bus bus = busService.updateBus(id, request);
            return ResponseEntity.ok(bus);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        try {
            busService.deleteBus(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
