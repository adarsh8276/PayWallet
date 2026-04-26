package com.example.service;
import com.example.entity.User;
public interface UserService {
User registerUser(User user);
User searchById(int id);
}