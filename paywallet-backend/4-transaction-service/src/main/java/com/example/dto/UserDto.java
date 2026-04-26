package com.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class UserDto {
private int userId;
private String userName;
private int phoneNo;
private String address;
private String email;
}
