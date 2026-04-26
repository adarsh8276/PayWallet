package com.example.service;

import org.hibernate.annotations.Comment;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class MockPaymentGateWay implements PaymentGatWay {

	@Override
	public String pay() {
		return "Its Mock payment gateway";
	}

}
