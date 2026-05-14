package com.ai.platform.datasource.config;

import lombok.Data;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.config.SingleServerConfig;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "redis.redisson")
public class RedissonConfig {

    private String address = "redis://localhost:6379";
    private String password;
    private int database = 0;
    private int connectionPoolSize = 64;
    private int connectionMinimumIdleSize = 24;

    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() {
        Config config = new Config();
        SingleServerConfig serverConfig = config.useSingleServer()
                .setAddress(address)
                .setDatabase(database)
                .setConnectionPoolSize(connectionPoolSize)
                .setConnectionMinimumIdleSize(connectionMinimumIdleSize);

        if (password != null && !password.isEmpty()) {
            serverConfig.setPassword(password);
        }

        return Redisson.create(config);
    }
}