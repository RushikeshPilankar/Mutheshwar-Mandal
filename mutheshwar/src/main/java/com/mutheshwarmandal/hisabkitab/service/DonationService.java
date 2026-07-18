package com.mutheshwarmandal.hisabkitab.service;

import com.mutheshwarmandal.hisabkitab.dto.DonationRequestDTO;
import com.mutheshwarmandal.hisabkitab.dto.DonationResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface DonationService {
    DonationResponseDTO create(DonationRequestDTO dto);
    DonationResponseDTO update(Long id, DonationRequestDTO dto);
    DonationResponseDTO getById(Long id);
    List<DonationResponseDTO> getAll(Integer festivalYear);
    void delete(Long id);
    List<DonationResponseDTO> filterByDateRange(LocalDate start, LocalDate end, Integer year);
    BigDecimal getTotalByDateRange(LocalDate start, LocalDate end, Integer year);
}