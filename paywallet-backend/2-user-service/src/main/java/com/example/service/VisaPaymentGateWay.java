package com.example.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("prod")
public class VisaPaymentGateWay implements PaymentGatWay {

	@Override
	public String pay() {
		return "Visa Payment gateway";
	}
}
