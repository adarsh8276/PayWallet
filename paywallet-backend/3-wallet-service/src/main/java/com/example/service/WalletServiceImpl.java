package com.example.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.dto.AddMoneyDto;
import com.example.dto.UserDto;
import com.example.entity.Wallet;
import com.example.entity.WalletStatus;
import com.example.repo.WalletRepository;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private WalletRepository walletRepo;

    @Override
    public Wallet registerNewWallet(int userId) {
        Wallet existing = walletRepo.findByUserId(userId);
        if (existing != null) throw new RuntimeException("Wallet already exists for this user");
        boolean userChk = verifyUser(userId);
        if (userChk) {
            Wallet w = new Wallet();
            w.setStatus(WalletStatus.ACTIVE);
            w.setUserId(userId);
            w.setWalletBalance(500);
            w.setCreatedDate(LocalDate.now());
            w.setLastUpdated(LocalDate.now());
            return walletRepo.save(w);
        }
        throw new RuntimeException("User not found");
    }

    @Override
    public Wallet getWalletByUserId(int userId) {
        Wallet wallet = walletRepo.findByUserId(userId);
        if (wallet == null) throw new RuntimeException("Wallet not found for userId: " + userId);
        return wallet;
    }

    @Override
    public Wallet updateWallet(Wallet wallet) {
        wallet.setLastUpdated(LocalDate.now());
        return walletRepo.save(wallet);
    }

    @Override
    public Wallet addMoney(AddMoneyDto addMoneyDto) {
        // Validate amount
        if (addMoneyDto.getAmt() <= 0) {
            throw new RuntimeException("Amount must be greater than 0");
        }
        if (addMoneyDto.getAmt() > 100000) {
            throw new RuntimeException("Cannot add more than ₹1,00,000 at once");
        }

        // Get wallet
        Wallet wallet = walletRepo.findByUserId(addMoneyDto.getUserId());
        if (wallet == null) {
            throw new RuntimeException("Wallet not found for userId: " + addMoneyDto.getUserId());
        }

        // Check wallet is active
        if (wallet.getStatus() != WalletStatus.ACTIVE) {
            throw new RuntimeException("Wallet is not active");
        }

        // Add money
        wallet.setWalletBalance(wallet.getWalletBalance() + addMoneyDto.getAmt());
        wallet.setLastUpdated(LocalDate.now());
        return walletRepo.save(wallet);
    }

    boolean verifyUser(int userId) {
        RestTemplate template = new RestTemplate();
        String url = "http://localhost:9000/users/" + userId;
        UserDto user = template.getForObject(url, UserDto.class);
        return user != null;
    }
}