package com.example.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class WalletDto {
    private int walletId;
    private float walletBalance;
    private int userId;
    private String status;
    private LocalDate createdDate;
    private LocalDate lastUpdated;
}