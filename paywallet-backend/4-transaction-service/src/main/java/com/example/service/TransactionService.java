package com.example.service;

import com.example.dto.TransactionDto;
import com.example.dto.TransactionNotificationDto;
import com.example.dto.UserDto;
import com.example.dto.WalletDto;
import com.example.entity.Transaction;
import com.example.repo.TransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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

    public UserDto fundTransfer(TransactionDto transactionDto) {
        log.info("Fund transfer from {} to {}", transactionDto.getFromUserId(), transactionDto.getToUserId());

        // 1. Get sender details
        String userUrl = "http://user-service/users/" + transactionDto.getFromUserId();
        UserDto fromUser = restTemplate.getForObject(userUrl, UserDto.class);

        // 2. Get receiver details
        String toUserUrl = "http://user-service/users/" + transactionDto.getToUserId();
        UserDto toUser = restTemplate.getForObject(toUserUrl, UserDto.class);

        // 3. Get sender wallet
        String fromWalletUrl = "http://3-wallet-service/wallet/user/" + transactionDto.getFromUserId();
        WalletDto fromWallet = restTemplate.getForObject(fromWalletUrl, WalletDto.class);

        // 4. Get receiver wallet
        String toWalletUrl = "http://3-wallet-service/wallet/user/" + transactionDto.getToUserId();
        WalletDto toWallet = restTemplate.getForObject(toWalletUrl, WalletDto.class);

        // 5. Check balance
        if (fromWallet == null || fromWallet.getWalletBalance() < transactionDto.getAmtToTransfer()) {
            throw new RuntimeException("Insufficient balance");
        }

        // 6. Deduct from sender wallet
        fromWallet.setWalletBalance(fromWallet.getWalletBalance() - transactionDto.getAmtToTransfer());
        restTemplate.put("http://3-wallet-service/wallet/update", fromWallet);

        // 7. Add to receiver wallet
        toWallet.setWalletBalance(toWallet.getWalletBalance() + transactionDto.getAmtToTransfer());
        restTemplate.put("http://3-wallet-service/wallet/update", toWallet);

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
            log.error("Failed to send notification: {}", e.getMessage());
        }

        return fromUser;
    }

    public List<Transaction> getTransactionHistory(int userId) {
        return transactionRepo.findByFromUserIdOrToUserId(userId, userId);
    }
}