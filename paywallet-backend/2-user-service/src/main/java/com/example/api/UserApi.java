package com.example.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.User;
import com.example.exception.ApplicationException;
import com.example.repository.UserRepository;
import com.example.service.PaymentGatWay;
import com.example.service.UserService;

import jakarta.validation.Valid;
import lombok.Data;

@RestController
@RequestMapping("/users")
public class UserApi {

    @Value("${gateway}")
    private String msg;

    @Autowired
    private PaymentGatWay gateWay;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping(consumes = {"application/xml", "application/json"})
    public ResponseEntity<User> registerNewUser(@RequestBody @Valid User user) {
        User u = userService.registerUser(user);
        return new ResponseEntity<>(u, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> searchById(@PathVariable("id") int id) {
        User u = userService.searchById(id);
        return new ResponseEntity<>(u, HttpStatus.OK);
    }

    // New login endpoint - accepts username + password
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUserName(loginRequest.getUserName());
        if (user == null) {
            throw new ApplicationException("User not found");
        }
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new ApplicationException("Invalid credentials");
        }
        return ResponseEntity.ok(user);
    }

    @GetMapping("/test")
    public String getMsg() {
        return msg;
    }

    @GetMapping("/pay")
    public String payment() {
        return gateWay.pay();
    }

    @Data
    static class LoginRequest {
        private String userName;
        private String password;
    }
}