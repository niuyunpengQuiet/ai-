package com.ai.platform.skill.plugin;

import lombok.extern.slf4j.Slf4j;
import org.pf4j.DefaultPluginManager;
import org.pf4j.PluginManager;
import org.pf4j.spring.SpringPluginManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;

@Slf4j
@Configuration
public class PluginManagerConfig {

    @Value("${pf4j.plugins-dir:plugins}")
    private String pluginsDir;

    @Value("${pf4j.auto-start:true}")
    private boolean autoStart;

    @Bean
    public PluginManager pluginManager() {
        PluginManager pm = new SpringPluginManager(Path.of(pluginsDir));

        if (autoStart) {
            pm.loadPlugins();
            pm.startPlugins();
            log.info("PF4J PluginManager started: {} plugins loaded, {} plugins started",
                    pm.getPlugins().size(), pm.getStartedPlugins().size());
            pm.getPlugins().forEach(p ->
                    log.info("  Plugin: {} ({}) - state: {}", p.getPluginId(), p.getPluginPath(), p.getPluginState()));
        }

        return pm;
    }
}