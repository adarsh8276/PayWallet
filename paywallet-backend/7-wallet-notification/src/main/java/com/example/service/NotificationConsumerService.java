package com.example.service;

import com.example.constants.AppConstants;
import com.example.dto.TransactionNotificationDto;
import com.example.dto.UserDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumerService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ObjectMapper objMapper;

    // Existing — registration email
    @KafkaListener(topics = AppConstants.NEW_USER, groupId = "group-id")
    public void consumeRegistrationMessage(ConsumerRecord<String, String> consumer) {
        try {
            UserDto userDto = objMapper.readValue(consumer.value(), UserDto.class);
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(userDto.getEmail());
            msg.setSubject("Welcome to PayWallet!");
            msg.setText("Hi " + userDto.getUserName() + ",\n\nWelcome to PayWallet! Your account has been created successfully.\n\nYour wallet is ready with ₹500 welcome bonus!\n\nThank you,\nPayWallet Team");
            mailSender.send(msg);
            System.out.println("Registration mail sent to " + userDto.getEmail());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // New — transfer received email
    @KafkaListener(topics = "TRANSFER_NOTIFICATION", groupId = "transfer-group")
    public void consumeTransferMessage(ConsumerRecord<String, String> consumer) {
        try {
            TransactionNotificationDto notif = objMapper.readValue(consumer.value(), TransactionNotificationDto.class);
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(notif.getToEmail());
            msg.setSubject("💰 Money Received - PayWallet");
            msg.setText(
                "Hi " + notif.getToUserName() + ",\n\n" +
                "You have received money in your PayWallet!\n\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n" +
                "Amount Received : ₹" + notif.getAmount() + "\n" +
                "Sent By         : " + notif.getFromUserName() + "\n" +
                "Date & Time     : " + notif.getDateTime() + "\n" +
                "━━━━━━━━━━━━━━━━━━━━━━\n\n" +
                "Your wallet balance has been updated.\n\n" +
                "Thank you,\nPayWallet Team"
            );
            mailSender.send(msg);
            System.out.println("Transfer mail sent to " + notif.getToEmail());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}