package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.UserDto;
import com.example.entity.User;
import com.example.exception.ApplicationException;
import com.example.repository.UserRepository;
@Service
public class UserServiceImpl implements UserService {

    Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private MessageSender msgSender;

    public User registerUser(User user) {
        User existingUser = userRepo.findByUserName(user.getUserName());
        if (existingUser != null) {
            throw new ApplicationException("User already present");
        }

        // ✅ Save to DB FIRST — don't let Kafka block or fail registration
        User savedUser = userRepo.save(user);

        // ✅ Kafka publish AFTER — failure here is logged but non-fatal
        try {
            UserDto userDto = new UserDto();
            BeanUtils.copyProperties(savedUser, userDto);
            msgSender.sendNotification(userDto);
        } catch (Exception e) {
            log.error("Kafka notification failed (non-fatal): {}", e.getMessage());
        }

        return savedUser;
    }

    public User searchById(int id) {
        log.info("searching the user {}", id);
        return userRepo.findById(id)
                .orElseThrow(() -> new ApplicationException("User not found"));
    }
}