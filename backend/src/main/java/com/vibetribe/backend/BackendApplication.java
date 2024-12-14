package com.vibetribe.backend;

import com.vibetribe.backend.infrastructure.system.config.RsaKeyConfigProperties;
import lombok.extern.java.Log;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Log
@SpringBootApplication
@EnableConfigurationProperties(RsaKeyConfigProperties.class)
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
