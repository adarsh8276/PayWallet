package com.example.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByFromUserIdOrToUserId(int fromUserId, int toUserId);
}