package com.ai.platform.observability.langfuse;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "langfuse")
public class LangfuseConfig {

    private String publicKey;
    private String secretKey;
    private String baseUrl = "https://cloud.langfuse.com";
    private boolean enabled = false;
}