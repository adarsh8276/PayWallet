package com.example.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Integer> {

    // Use query to get the first/latest wallet for a user
    // Prevents "Query did not return a unique result" error if duplicates exist
    @Query("SELECT w FROM Wallet w WHERE w.userId = :userId ORDER BY w.walletId DESC")
    java.util.List<Wallet> findAllByUserId(@Param("userId") int userId);

    default Wallet findByUserId(int userId) {
        java.util.List<Wallet> wallets = findAllByUserId(userId);
        if (wallets == null || wallets.isEmpty()) return null;
        return wallets.get(0); // return the latest wallet
    }
}