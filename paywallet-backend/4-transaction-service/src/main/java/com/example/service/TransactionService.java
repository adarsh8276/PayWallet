package com.example.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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

        if (transactionDto.getFromUserId() == transactionDto.getToUserId()) {
            throw new RuntimeException("Cannot transfer to yourself");
        }

        if (transactionDto.getAmtToTransfer() <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }

        // 1. Get sender
        UserDto fromUser = restTemplate.getForObject(
            userServiceUrl + "/users/" + transactionDto.getFromUserId(), UserDto.class);
        if (fromUser == null) throw new RuntimeException("Sender not found");

        // 2. Get receiver
        UserDto toUser = restTemplate.getForObject(
            userServiceUrl + "/users/" + transactionDto.getToUserId(), UserDto.class);
        if (toUser == null) throw new RuntimeException("Receiver not found");

        // 3. Get sender wallet - use ResponseEntity to get full object including dates
        ResponseEntity<WalletDto> fromWalletResp = restTemplate.getForEntity(
            walletServiceUrl + "/wallet/user/" + transactionDto.getFromUserId(), WalletDto.class);
        WalletDto fromWallet = fromWalletResp.getBody();
        if (fromWallet == null) throw new RuntimeException("Sender wallet not found");

        // 4. Get receiver wallet
        ResponseEntity<WalletDto> toWalletResp = restTemplate.getForEntity(
            walletServiceUrl + "/wallet/user/" + transactionDto.getToUserId(), WalletDto.class);
        WalletDto toWallet = toWalletResp.getBody();
        if (toWallet == null) throw new RuntimeException("Receiver wallet not found");

        // 5. Check balance
        if (fromWallet.getWalletBalance() < transactionDto.getAmtToTransfer()) {
            throw new RuntimeException("Insufficient balance");
        }

        // 6. Deduct from sender
        fromWallet.setWalletBalance(fromWallet.getWalletBalance() - transactionDto.getAmtToTransfer());
        fromWallet.setLastUpdated(LocalDate.now());
        restTemplate.put(walletServiceUrl + "/wallet/update", fromWallet);

        // 7. Add to receiver
        toWallet.setWalletBalance(toWallet.getWalletBalance() + transactionDto.getAmtToTransfer());
        toWallet.setLastUpdated(LocalDate.now());
        restTemplate.put(walletServiceUrl + "/wallet/update", toWallet);

        // 8. Save transaction
        Transaction txn = new Transaction();
        txn.setFromUserId(transactionDto.getFromUserId());
        txn.setToUserId(transactionDto.getToUserId());
        txn.setAmtToTransfer(transactionDto.getAmtToTransfer());
        txn.setStatus("SUCCESS");
        txn.setTransactionDate(LocalDateTime.now());
        transactionRepo.save(txn);

        // 9. Kafka notification (non-fatal)
        try {
            TransactionNotificationDto notif = new TransactionNotificationDto();
            notif.setToEmail(toUser.getEmail());
            notif.setToUserName(toUser.getUserName());
            notif.setFromUserName(fromUser.getUserName());
            notif.setAmount(transactionDto.getAmtToTransfer());
            notif.setDateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));
            kafkaTemplate.send("TRANSFER_NOTIFICATION", objectMapper.writeValueAsString(notif));
        } catch (Exception e) {
            log.error("Kafka notification failed (non-fatal): {}", e.getMessage());
        }

        return fromUser;
    }

    public List<Transaction> getTransactionHistory(int userId) {
        return transactionRepo.findByFromUserIdOrToUserId(userId, userId);
    }
}