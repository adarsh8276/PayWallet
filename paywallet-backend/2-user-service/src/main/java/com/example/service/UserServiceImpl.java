package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dto.UserDto;
import com.example.entity.User;
import com.example.exception.ApplicationException;
import com.example.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class UserServiceImpl implements UserService {

    Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private MessageSender msgSender;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public User registerUser(User user) {
        // Ensure userId is 0 so DB auto-generates it
        user.setUserId(0);

        User existingUser = userRepo.findByUserName(user.getUserName());
        if (existingUser != null) {
            throw new ApplicationException("User already present");
        }

        // Save to DB
        User savedUser = userRepo.save(user);

        // Flush and detach so no further Hibernate tracking on this entity
        entityManager.flush();
        entityManager.detach(savedUser);

        // Kafka publish AFTER detach — completely isolated from the JPA session
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