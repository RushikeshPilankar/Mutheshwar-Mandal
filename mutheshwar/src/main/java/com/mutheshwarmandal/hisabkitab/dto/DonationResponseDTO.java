package com.mutheshwarmandal.hisabkitab.dto;

import com.mutheshwarmandal.hisabkitab.entity.PaymentMode;
import com.mutheshwarmandal.hisabkitab.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
public class DonationResponseDTO {
    private Long id;
    private Integer pavtiNo;
    private String name;
    private String homeFlatNo;
    private String address;
    private String mobileNo;
    private String email;
    private BigDecimal amount;
    private PaymentMode paymentMode;
    private String upiId;
    private PaymentStatus status;
    private LocalDate collectionDate;
    private Integer festivalYear;
}