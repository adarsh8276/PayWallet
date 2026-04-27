package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	// @LoadBalanced REMOVED — LoadBalanced RestTemplate only works with Eureka service names.
	// We use direct Render URLs via env vars, so a plain RestTemplate is needed.
	@Bean
	public RestTemplate getTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}
}