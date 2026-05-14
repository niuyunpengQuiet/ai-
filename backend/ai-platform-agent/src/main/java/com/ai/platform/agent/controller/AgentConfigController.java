package com.ai.platform.agent.controller;

import com.ai.platform.agent.model.AgentConfig;
import com.ai.platform.agent.model.AgentConfigDTO;
import com.ai.platform.agent.service.AgentConfigService;
import com.ai.platform.common.result.R;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class AgentConfigController {

    private final AgentConfigService agentConfigService;

    @GetMapping
    public R<List<AgentConfig>> list() {
        return R.ok(agentConfigService.listAll());
    }

    @GetMapping("/{id}")
    public R<AgentConfig> get(@PathVariable String id) {
        return R.ok(agentConfigService.getById(id));
    }

    @PostMapping
    public R<AgentConfig> create(@Valid @RequestBody AgentConfigDTO dto) {
        return R.ok(agentConfigService.create(dto));
    }

    @PutMapping("/{id}")
    public R<AgentConfig> update(@PathVariable String id, @Valid @RequestBody AgentConfigDTO dto) {
        return R.ok(agentConfigService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable String id) {
        agentConfigService.delete(id);
        return R.ok();
    }
}