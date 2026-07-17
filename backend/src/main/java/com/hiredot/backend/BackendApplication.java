package com.hiredot.backend;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@PostConstruct
	public void logStartupBanner() {
		log.info("======================================================");
		log.info(" HireDot backend started");
		log.info(" AI Model = Groq llama-3.3-70b-versatile");
		log.info(" build = 2026-07-18-flash-latest-v3");
		log.info("======================================================");
	}
}
