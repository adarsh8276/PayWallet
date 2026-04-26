package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
	//query methid
	User findByUserName(String name);
}
