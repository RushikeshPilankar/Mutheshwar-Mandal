package com.mutheshwarmandal.hisabkitab.service;

import com.mutheshwarmandal.hisabkitab.dto.DonationRequestDTO;
import com.mutheshwarmandal.hisabkitab.dto.DonationResponseDTO;
import com.mutheshwarmandal.hisabkitab.entity.DonationRecord;
import com.mutheshwarmandal.hisabkitab.exception.DuplicateResourceException;
import com.mutheshwarmandal.hisabkitab.exception.ResourceNotFoundException;
import com.mutheshwarmandal.hisabkitab.repository.DonationRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {

    private final DonationRecordRepository repository;

    @Override
    public DonationResponseDTO create(DonationRequestDTO dto) {
    	
        if (repository.existsByPavtiNoAndFestivalYear(dto.getPavtiNo(), dto.getFestivalYear())) {
            throw new DuplicateResourceException(
                    "Pavti No. " + dto.getPavtiNo() + " already exists for year " +
                    dto.getFestivalYear() + ". Please use a different Pavti No."
            );
        }
        DonationRecord record = DonationRecord.builder()
                .pavtiNo(dto.getPavtiNo())
                .name(dto.getName())
                .homeFlatNo(dto.getHomeFlatNo())
                .address(dto.getAddress())
                .mobileNo(dto.getMobileNo())
                .email(dto.getEmail())
                .amount(dto.getAmount())
                .paymentMode(dto.getPaymentMode())
                .upiId(dto.getUpiId())
                .status(dto.getStatus())
                .collectionDate(dto.getCollectionDate())
                .festivalYear(dto.getFestivalYear())
                .build();

        DonationRecord saved = repository.save(record);
        return toResponseDTO(saved);
    }

    @Override
    public DonationResponseDTO update(Long id, DonationRequestDTO dto) {
        DonationRecord record = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));

        record.setName(dto.getName());
        record.setHomeFlatNo(dto.getHomeFlatNo());
        record.setAddress(dto.getAddress());
        record.setMobileNo(dto.getMobileNo());
        record.setEmail(dto.getEmail());
        record.setAmount(dto.getAmount());
        record.setPaymentMode(dto.getPaymentMode());
        record.setUpiId(dto.getUpiId());
        record.setStatus(dto.getStatus());
        record.setCollectionDate(dto.getCollectionDate());

        DonationRecord updated = repository.save(record);
        return toResponseDTO(updated);
    }

    @Override
    public DonationResponseDTO getById(Long id) {
        DonationRecord record = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Record not found with id: " + id));
        return toResponseDTO(record);
    }

    @Override
    public List<DonationResponseDTO> getAll(Integer festivalYear) {
        return repository.findByFestivalYear(festivalYear)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Record not found with id: " + id);
        }
        repository.deleteById(id);
    }

    @Override
    public List<DonationResponseDTO> filterByDateRange(LocalDate start, LocalDate end, Integer year) {
        return repository.findByCollectionDateBetweenAndFestivalYear(start, end, year)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BigDecimal getTotalByDateRange(LocalDate start, LocalDate end, Integer year) {
        return repository.sumAmountBetweenDates(start, end, year);
    }

    private DonationResponseDTO toResponseDTO(DonationRecord record) {
        return DonationResponseDTO.builder()
                .id(record.getId())
                .pavtiNo(record.getPavtiNo())
                .name(record.getName())
                .homeFlatNo(record.getHomeFlatNo())
                .address(record.getAddress())
                .mobileNo(record.getMobileNo())
                .email(record.getEmail())
                .amount(record.getAmount())
                .paymentMode(record.getPaymentMode())
                .upiId(record.getUpiId())
                .status(record.getStatus())
                .collectionDate(record.getCollectionDate())
                .festivalYear(record.getFestivalYear())
                .build();
    }
}