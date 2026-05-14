package com.ai.platform.skill.registry;

import com.ai.platform.sdk.SkillContext;
import com.ai.platform.sdk.SkillExtension;
import com.ai.platform.sdk.SkillResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pf4j.PluginManager;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class SkillRegistry {

    private final PluginManager pluginManager;

    public List<SkillExtension> listExtensions() {
        return pluginManager.getExtensions(SkillExtension.class);
    }

    public List<String> listSkillIds() {
        return listExtensions().stream()
                .map(SkillExtension::getSkillId)
                .collect(Collectors.toList());
    }

    public SkillExtension getExtension(String skillId) {
        return listExtensions().stream()
                .filter(ext -> ext.getSkillId().equals(skillId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Skill plugin not found: " + skillId));
    }

    public SkillResult invoke(String skillId, SkillContext context) {
        SkillExtension ext = getExtension(skillId);
        long start = System.currentTimeMillis();
        try {
            SkillResult result = ext.execute(context);
            result.setPluginId(ext.getSkillId());
            result.setDurationMs(System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            log.error("Skill plugin execution failed: skillId={}, error={}", skillId, e.getMessage(), e);
            SkillResult fail = SkillResult.fail(e.getMessage());
            fail.setPluginId(skillId);
            fail.setDurationMs(System.currentTimeMillis() - start);
            return fail;
        }
    }

    public int reloadAll() {
        pluginManager.loadPlugins();
        pluginManager.startPlugins();
        log.info("All plugins reloaded: {} extensions available", listExtensions().size());
        return listExtensions().size();
    }

    public String loadPlugin(String pluginPath) {
        String pluginId = pluginManager.loadPlugin(Path.of(pluginPath));
        if (pluginId != null) {
            pluginManager.startPlugin(pluginId);
            log.info("Plugin loaded and started: {}", pluginId);
        }
        return pluginId;
    }

    public boolean unloadPlugin(String pluginId) {
        pluginManager.stopPlugin(pluginId);
        boolean removed = pluginManager.unloadPlugin(pluginId);
        if (removed) {
            log.info("Plugin unloaded: {}", pluginId);
        }
        return removed;
    }

    public boolean startPlugin(String pluginId) {
        return pluginManager.startPlugin(pluginId) != null;
    }

    public boolean stopPlugin(String pluginId) {
        return pluginManager.stopPlugin(pluginId) != null;
    }
}
