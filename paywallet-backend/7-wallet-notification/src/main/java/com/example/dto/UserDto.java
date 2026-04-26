package com.example.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;


public class UserDto {
private int userId;
private String userName;
private int phoneNo;
private String address;
private String email;
public int getUserId() {
	return userId;
}
public void setUserId(int userId) {
	this.userId = userId;
}
public String getUserName() {
	return userName;
}
public void setUserName(String userName) {
	this.userName = userName;
}
public int getPhoneNo() {
	return phoneNo;
}
public void setPhoneNo(int phoneNo) {
	this.phoneNo = phoneNo;
}
public String getAddress() {
	return address;
}
public void setAddress(String address) {
	this.address = address;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}


}
