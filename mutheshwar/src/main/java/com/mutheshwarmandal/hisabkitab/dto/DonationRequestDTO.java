package com.mutheshwarmandal.hisabkitab.dto;

import com.mutheshwarmandal.hisabkitab.entity.PaymentMode;
import com.mutheshwarmandal.hisabkitab.entity.PaymentStatus;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class DonationRequestDTO {

    @NotNull
    private Integer pavtiNo;

    @NotBlank
    private String name;

    private String homeFlatNo;

    @NotBlank
    private String address;

    private String mobileNo;

    @Email
    private String email;

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotNull
    private PaymentMode paymentMode;

    private String upiId;

    @NotNull
    private PaymentStatus status;

    @NotNull
    private LocalDate collectionDate;

    @NotNull
    private Integer festivalYear;
}