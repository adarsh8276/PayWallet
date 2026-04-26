package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
//	@Bean
//	@LoadBalanced
//	public RestTemplate getTemplate(  ) {
//		return new RestTemplate();
//	}
	@Bean
	@LoadBalanced
	public RestTemplate getTemplate( RestTemplateBuilder builder ) {
		return  builder.build();
	}

}
