package com.example.dto;

import lombok.Data;

@Data
public class WalletDto {
    private int walletId;
    private float walletBalance;
    private int userId;
    private String status;
}