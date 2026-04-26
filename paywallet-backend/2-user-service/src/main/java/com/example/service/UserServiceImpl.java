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
	
	Logger log=LoggerFactory.getLogger(UserServiceImpl.class);
	@Autowired
	private UserRepository userRepo;
	@Autowired
	private MessageSender msgSender;
	public User registerUser(User user) {
		User existingUser=userRepo.findByUserName(user.getUserName());
	
		if(existingUser!=null) {
			throw new ApplicationException("User already present");
		}
		UserDto userDto= new UserDto();
		BeanUtils.copyProperties(user, userDto);
		msgSender.sendNotification(userDto);
		return userRepo.save(user);
	}
	public User searchById(int id) {
		log.info("searching the user {}",id);
		//why optional ????
		return userRepo.findById(id).orElseThrow(()-> new ApplicationException("User not found"));
	}

}
