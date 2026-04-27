package com.example.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.dto.TransactionDto;
import com.example.dto.TransactionNotificationDto;
import com.example.dto.UserDto;
import com.example.dto.WalletDto;
import com.example.entity.Transaction;
import com.example.repo.TransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class TransactionService {

    private Logger log = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private TransactionRepository transactionRepo;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${user.service.url}")
    private String userServiceUrl;

    @Value("${wallet.service.url}")
    private String walletServiceUrl;

    public UserDto fundTransfer(TransactionDto transactionDto) {
        log.info("Fund transfer from {} to {}", transactionDto.getFromUserId(), transactionDto.getToUserId());

        // 1. Get sender details
        UserDto fromUser = restTemplate.getForObject(userServiceUrl + "/users/" + transactionDto.getFromUserId(), UserDto.class);
        if (fromUser == null) throw new RuntimeException("Sender not found");

        // 2. Get receiver details
        UserDto toUser = restTemplate.getForObject(userServiceUrl + "/users/" + transactionDto.getToUserId(), UserDto.class);
        if (toUser == null) throw new RuntimeException("Receiver not found");

        // 3. Get sender wallet
        WalletDto fromWallet = restTemplate.getForObject(walletServiceUrl + "/wallet/user/" + transactionDto.getFromUserId(), WalletDto.class);

        // 4. Get receiver wallet
        WalletDto toWallet = restTemplate.getForObject(walletServiceUrl + "/wallet/user/" + transactionDto.getToUserId(), WalletDto.class);

        // 5. Check balance
        if (fromWallet == null || fromWallet.getWalletBalance() < transactionDto.getAmtToTransfer()) {
            throw new RuntimeException("Insufficient balance");
        }

        if (transactionDto.getFromUserId() == transactionDto.getToUserId()) {
            throw new RuntimeException("Cannot transfer to yourself");
        }

        // 6. Deduct from sender wallet
        fromWallet.setWalletBalance(fromWallet.getWalletBalance() - transactionDto.getAmtToTransfer());
        restTemplate.put(walletServiceUrl + "/wallet/update", fromWallet);

        // 7. Add to receiver wallet
        toWallet.setWalletBalance(toWallet.getWalletBalance() + transactionDto.getAmtToTransfer());
        restTemplate.put(walletServiceUrl + "/wallet/update", toWallet);

        // 8. Save transaction in DB
        Transaction txn = new Transaction();
        txn.setFromUserId(transactionDto.getFromUserId());
        txn.setToUserId(transactionDto.getToUserId());
        txn.setAmtToTransfer(transactionDto.getAmtToTransfer());
        txn.setStatus("SUCCESS");
        txn.setTransactionDate(LocalDateTime.now());
        transactionRepo.save(txn);

        // 9. Send Kafka notification to receiver
        try {
            TransactionNotificationDto notif = new TransactionNotificationDto();
            notif.setToEmail(toUser.getEmail());
            notif.setToUserName(toUser.getUserName());
            notif.setFromUserName(fromUser.getUserName());
            notif.setAmount(transactionDto.getAmtToTransfer());
            notif.setDateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));
            String json = objectMapper.writeValueAsString(notif);
            kafkaTemplate.send("TRANSFER_NOTIFICATION", json);
            log.info("Notification sent to Kafka");
        } catch (Exception e) {
            log.error("Failed to send Kafka notification (non-fatal): {}", e.getMessage());
        }

        return fromUser;
    }

    public List<Transaction> getTransactionHistory(int userId) {
        return transactionRepo.findByFromUserIdOrToUserId(userId, userId);
    }
}