package com.example.dto;

import lombok.Data;

@Data
public class TransactionDto {
private int fromUserId;
private int toUserId;
private float amtToTransfer;

}
