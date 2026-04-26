package com.example.config;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class EmailConfig {

    @Value("${mail.username}")
    private String mailUsername;

    @Value("${mail.password}")
    private String mailPassword;

    @Bean
    SimpleMailMessage getMailMessage() {
        return new SimpleMailMessage();
    }

    @Bean
    JavaMailSenderImpl getMailSender() {
        JavaMailSenderImpl javaMailSender = new JavaMailSenderImpl();
        javaMailSender.setHost("smtp.gmail.com");
        javaMailSender.setPort(465);
        javaMailSender.setUsername(mailUsername);
        javaMailSender.setPassword(mailPassword);

        Properties properties = javaMailSender.getJavaMailProperties();
        properties.put("mail.smtp.ssl.enable", "true");
        properties.put("mail.debug", true);

        return javaMailSender;
    }
}