package com.ai.platform.agent.graph;

import com.ai.platform.agent.model.OrchestrationRequest;
import com.ai.platform.agent.model.OrchestrationResponse;
import com.ai.platform.common.enums.OrchestrationPattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrchestrationEngine {

    private final Map<String, GraphExecutor> executorMap;

    public OrchestrationResponse execute(OrchestrationRequest request) {
        String patternCode = request.getPattern() != null
                ? request.getPattern().getCode()
                : OrchestrationPattern.ROUTER_MOE.getCode();

        GraphExecutor executor = executorMap.get(patternCode);
        if (executor == null) {
            throw new IllegalArgumentException("Unknown orchestration pattern: " + patternCode);
        }

        log.info("Orchestrating with pattern: {}, input: {}", patternCode, request.getUserInput());
        return executor.execute(request);
    }
}