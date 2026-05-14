package com.ai.platform.datasource.config;

import com.baomidou.dynamic.datasource.DynamicRoutingDataSource;
import com.baomidou.dynamic.datasource.provider.AbstractDataSourceProvider;
import com.baomidou.dynamic.datasource.provider.DynamicDataSourceProvider;
import com.baomidou.dynamic.datasource.spring.boot.autoconfigure.DataSourceProperty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Map;

@Slf4j
@Configuration
public class DynamicDataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.dynamic.datasource.dm")
    public DataSourceProperty dmDataSourceProperty() {
        log.info("DM (达梦) datasource property initialized");
        return new DataSourceProperty();
    }

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.dynamic.datasource.doris")
    public DataSourceProperty dorisDataSourceProperty() {
        log.info("Doris datasource property initialized");
        return new DataSourceProperty();
    }
}