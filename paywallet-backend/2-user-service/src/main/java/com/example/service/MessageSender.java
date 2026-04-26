package com.example.service;

import org.apache.catalina.realm.UserDatabaseRealm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.example.constants.AppConstants;
import com.example.dto.UserDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class MessageSender {
	@Autowired
private KafkaTemplate<String, String> kafkaTemplate;
	@Autowired
	private ObjectMapper objectMapper;
	public void sendNotification(UserDto userDto) {
		try {
			String jsonText=objectMapper.writeValueAsString(userDto);
			System.out.println(jsonText);
			kafkaTemplate.send(AppConstants.NEW_USER,userDto.getUserName(),jsonText);
			System.out.println("send to kafka");
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}
}
