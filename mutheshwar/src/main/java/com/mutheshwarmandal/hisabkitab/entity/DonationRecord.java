package com.mutheshwarmandal.hisabkitab.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_record", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"pavti_no", "festival_year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pavti_no", nullable = false)
    private Integer pavtiNo;

    @Column(nullable = false)
    private String name;

    @Column(name = "home_flat_no")
    private String homeFlatNo;

    @Column(nullable = false)
    private String address;

    private String mobileNo;

    private String email;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode", nullable = false)
    private PaymentMode paymentMode;

    @Column(name = "upi_id")
    private String upiId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(name = "collection_date", nullable = false)
    private LocalDate collectionDate;

    @Column(name = "festival_year", nullable = false)
    private Integer festivalYear;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}