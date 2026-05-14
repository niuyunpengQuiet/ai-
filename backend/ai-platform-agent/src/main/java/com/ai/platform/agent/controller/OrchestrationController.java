package com.ai.platform.agent.controller;

import com.ai.platform.agent.graph.OrchestrationEngine;
import com.ai.platform.agent.model.OrchestrationRequest;
import com.ai.platform.agent.model.OrchestrationResponse;
import com.ai.platform.common.annotation.RateLimit;
import com.ai.platform.common.result.R;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orchestration")
@RequiredArgsConstructor
public class OrchestrationController {

    private final OrchestrationEngine orchestrationEngine;

    @RateLimit(key = "orchestration", permits = 30, period = 1)
    @PostMapping("/execute")
    public R<OrchestrationResponse> execute(@Valid @RequestBody OrchestrationRequest request) {
        return R.ok(orchestrationEngine.execute(request));
    }
}