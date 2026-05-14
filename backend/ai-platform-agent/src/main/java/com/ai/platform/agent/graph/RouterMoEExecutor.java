package com.ai.platform.agent.graph;

import com.ai.platform.agent.model.OrchestrationRequest;
import com.ai.platform.agent.model.OrchestrationResponse;
import com.ai.platform.common.enums.OrchestrationPattern;
import com.ai.platform.observability.metrics.AgentMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RouterMoEExecutor implements GraphExecutor {

    private final AgentMetrics agentMetrics;

    @Override
    public String getPatternCode() {
        return OrchestrationPattern.ROUTER_MOE.getCode();
    }

    @Override
    public OrchestrationResponse execute(OrchestrationRequest request) {
        long start = System.currentTimeMillis();

        // Simulate Router-MoE pattern
        String routedAgentId = resolveAgent(request);

        OrchestrationResponse response = new OrchestrationResponse();
        response.setContent("[Router-MoE] 已将请求路由至 " + routedAgentId + " 处理。");
        response.setRoutedAgentId(routedAgentId);
        response.setCotTrace("Intent Classification -> Weight Calculation -> Agent Selection");

        List<OrchestrationResponse.StepTrace> steps = new ArrayList<>();
        OrchestrationResponse.StepTrace step1 = new OrchestrationResponse.StepTrace();
        step1.setStep("1");
        step1.setAction("Intent Classification");
        step1.setObservation("识别为法务咨询类问题");
        steps.add(step1);

        OrchestrationResponse.StepTrace step2 = new OrchestrationResponse.StepTrace();
        step2.setStep("2");
        step2.setAction("Weight Calculation");
        step2.setObservation("法务专家权重: 0.85, 经侦专家权重: 0.15");
        steps.add(step2);

        OrchestrationResponse.StepTrace step3 = new OrchestrationResponse.StepTrace();
        step3.setStep("3");
        step3.setAction("Agent Selection");
        step3.setObservation("选中: " + routedAgentId);
        steps.add(step3);

        response.setSteps(steps);

        long duration = System.currentTimeMillis() - start;
        agentMetrics.recordOrchestration(duration, 150);
        return response;
    }

    private String resolveAgent(OrchestrationRequest request) {
        if (request.getAgentWeights() != null && !request.getAgentWeights().isEmpty()) {
            return request.getAgentWeights().entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse("agt-worker-legal");
        }
        return "agt-worker-legal";
    }
}