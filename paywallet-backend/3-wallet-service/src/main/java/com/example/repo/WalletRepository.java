package com.example.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {
    Wallet findByUserId(int userId);

}
