package com.example.entity;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class User {
	@Id
private int userId;
	@NotNull(message = "userName cant blank/null")
	@NotBlank(message = "userName cant blank/null")
	@Column(unique = true)
private String userName;
	@NotNull(message = "password cant blank/null")
	@NotBlank(message = "password cant blank/null")
	// @Length (value =8,message = "password have atleast 8 chars")
	//@JsonIgnore
private String password;
	@Min(value = 1000,message = "phone number min val not sufficient")
private int phoneNo;
private String address;
private String email;

}
//username=null
//username=""