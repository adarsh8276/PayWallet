package com.example.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Wallet {
	@Id
	@GeneratedValue
private int walletId;
private float walletBalance;
private LocalDate createdDate;
private LocalDate lastUpdated;
private WalletStatus status;
private int userId;

}
