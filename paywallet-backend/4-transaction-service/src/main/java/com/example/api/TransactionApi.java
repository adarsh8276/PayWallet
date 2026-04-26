package com.example.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.TransactionDto;
import com.example.dto.UserDto;
import com.example.entity.Transaction;
import com.example.service.TransactionService;

@RestController
public class TransactionApi {

    @Autowired
    private TransactionService service;

    @PostMapping("/transfer")
    public UserDto fundTransfer(@RequestBody TransactionDto transactionDto) {
        return service.fundTransfer(transactionDto);
    }

    @GetMapping("/transactions/user/{userId}")
    public List<Transaction> getHistory(@PathVariable int userId) {
        return service.getTransactionHistory(userId);
    }
}