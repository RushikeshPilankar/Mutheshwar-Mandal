package com.mutheshwarmandal.hisabkitab.controller;

import com.mutheshwarmandal.hisabkitab.dto.DonationRequestDTO;
import com.mutheshwarmandal.hisabkitab.dto.DonationResponseDTO;
import com.mutheshwarmandal.hisabkitab.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "https://mutheshwarmandal.netlify.app"})
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    public ResponseEntity<DonationResponseDTO> create(@Valid @RequestBody DonationRequestDTO dto) {
        return new ResponseEntity<>(donationService.create(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationResponseDTO> update(
            @PathVariable Long id, @Valid @RequestBody DonationRequestDTO dto) {
        return ResponseEntity.ok(donationService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<DonationResponseDTO>> getAll(
            @RequestParam Integer festivalYear) {
        return ResponseEntity.ok(donationService.getAll(festivalYear));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        donationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<DonationResponseDTO>> filterByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam Integer festivalYear) {
        return ResponseEntity.ok(donationService.filterByDateRange(start, end, festivalYear));
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotal(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @RequestParam Integer festivalYear) {
        return ResponseEntity.ok(donationService.getTotalByDateRange(start, end, festivalYear));
    }
}