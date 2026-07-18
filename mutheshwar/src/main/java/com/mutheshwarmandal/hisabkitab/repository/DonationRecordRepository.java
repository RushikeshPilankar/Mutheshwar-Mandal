package com.mutheshwarmandal.hisabkitab.repository;

import com.mutheshwarmandal.hisabkitab.entity.DonationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface DonationRecordRepository extends JpaRepository<DonationRecord, Long> {

    List<DonationRecord> findByFestivalYear(Integer year);

    List<DonationRecord> findByCollectionDateBetweenAndFestivalYear(
            LocalDate start, LocalDate end, Integer year);

    @Query("SELECT COALESCE(SUM(d.amount), 0) FROM DonationRecord d " +
           "WHERE d.collectionDate BETWEEN :start AND :end AND d.festivalYear = :year")
    BigDecimal sumAmountBetweenDates(
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            @Param("year") Integer year);

    List<DonationRecord> findByStatus(com.mutheshwarmandal.hisabkitab.entity.PaymentStatus status);
}