package com.example.dto;

import lombok.Data;

@Data
public class TransactionNotificationDto {
    private String toEmail;
    private String toUserName;
    private String fromUserName;
    private float amount;
    private String dateTime;
}