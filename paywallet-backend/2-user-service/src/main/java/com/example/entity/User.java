package com.example.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @NotNull(message = "userName cant blank/null")
    @NotBlank(message = "userName cant blank/null")
    @Column(unique = true)
    private String userName;

    @NotNull(message = "password cant blank/null")
    @NotBlank(message = "password cant blank/null")
    private String password;

    @Min(value = 1000, message = "phone number min val not sufficient")
    private int phoneNo;

    private String address;
    private String email;
}