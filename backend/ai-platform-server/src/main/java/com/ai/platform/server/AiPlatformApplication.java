package com.ai.platform.server;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.ai.platform.**.service")
public class AiPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiPlatformApplication.class, args);
    }
}