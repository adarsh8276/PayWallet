package com.example.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.AddMoneyDto;
import com.example.entity.Wallet;
import com.example.service.WalletService;

@RestController
@RequestMapping("/wallet")
public class WalletApi {

    @Autowired
    private WalletService walletService;

    // Create wallet
    @PostMapping("/{userId}")
    public ResponseEntity<Wallet> registerNewWallet(@PathVariable int userId) {
        return ResponseEntity.ok(walletService.registerNewWallet(userId));
    }

    // Get wallet by userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<Wallet> getWalletByUser(@PathVariable int userId) {
        return ResponseEntity.ok(walletService.getWalletByUserId(userId));
    }

    // Update wallet (called internally by transaction-service)
    @PutMapping("/update")
    public ResponseEntity<Wallet> updateWallet(@RequestBody Wallet wallet) {
        return ResponseEntity.ok(walletService.updateWallet(wallet));
    }

    // Add money to wallet
    @PostMapping("/add-money")
    public ResponseEntity<Wallet> addMoney(@RequestBody AddMoneyDto addMoneyDto) {
        Wallet updated = walletService.addMoney(addMoneyDto);
        return ResponseEntity.ok(updated);
    }
}