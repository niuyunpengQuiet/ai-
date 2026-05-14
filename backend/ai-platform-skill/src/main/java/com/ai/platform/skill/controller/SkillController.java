package com.ai.platform.skill.controller;

import com.ai.platform.common.result.R;
import com.ai.platform.sdk.SkillContext;
import com.ai.platform.sdk.SkillResult;
import com.ai.platform.skill.model.SkillConfig;
import com.ai.platform.skill.model.SkillConfigDTO;
import com.ai.platform.skill.model.SkillInvocation;
import com.ai.platform.skill.registry.SkillRegistry;
import com.ai.platform.skill.service.SkillConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pf4j.PluginManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillConfigService skillConfigService;
    private final SkillRegistry skillRegistry;
    private final PluginManager pluginManager;

    // ===== Skill Config CRUD =====

    @GetMapping
    public R<List<SkillConfig>> list() {
        return R.ok(skillConfigService.listAll());
    }

    @PostMapping
    public R<SkillConfig> create(@Valid @RequestBody SkillConfigDTO dto) {
        return R.ok(skillConfigService.create(dto));
    }

    @PutMapping("/{id}")
    public R<SkillConfig> update(@PathVariable String id, @Valid @RequestBody SkillConfigDTO dto) {
        return R.ok(skillConfigService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable String id) {
        skillConfigService.delete(id);
        return R.ok();
    }

    // ===== Skill Invocation (via PF4J) =====

    @PostMapping("/invoke")
    public R<SkillResult> invoke(@RequestBody SkillInvocation invocation) {
        SkillContext ctx = SkillContext.of(
                invocation.getSkillId(),
                invocation.getInput(),
                invocation.getParams(),
                null, null
        );
        return R.ok(skillRegistry.invoke(invocation.getSkillId(), ctx));
    }

    // ===== PF4J Plugin Lifecycle =====

    @GetMapping("/plugins")
    public R<List<Map<String, Object>>> listPlugins() {
        List<Map<String, Object>> plugins = pluginManager.getPlugins().stream()
                .map(pw -> Map.<String, Object>of(
                        "pluginId", pw.getPluginId(),
                        "state", pw.getPluginState().toString(),
                        "path", pw.getPluginPath().toString(),
                        "version", pw.getDescriptor().getVersion()
                ))
                .collect(Collectors.toList());
        return R.ok(plugins);
    }

    @GetMapping("/extensions")
    public R<List<Map<String, String>>> listExtensions() {
        List<Map<String, String>> exts = skillRegistry.listExtensions().stream()
                .map(ext -> Map.of(
                        "skillId", ext.getSkillId(),
                        "name", ext.getSkillName(),
                        "version", ext.getVersion()
                ))
                .collect(Collectors.toList());
        return R.ok(exts);
    }

    @PostMapping("/plugins/reload")
    public R<Integer> reloadAll() {
        return R.ok(skillRegistry.reloadAll());
    }

    @PostMapping("/plugins/{pluginId}/start")
    public R<Boolean> startPlugin(@PathVariable String pluginId) {
        return R.ok(skillRegistry.startPlugin(pluginId));
    }

    @PostMapping("/plugins/{pluginId}/stop")
    public R<Boolean> stopPlugin(@PathVariable String pluginId) {
        return R.ok(skillRegistry.stopPlugin(pluginId));
    }

    @DeleteMapping("/plugins/{pluginId}")
    public R<Boolean> unloadPlugin(@PathVariable String pluginId) {
        return R.ok(skillRegistry.unloadPlugin(pluginId));
    }
}