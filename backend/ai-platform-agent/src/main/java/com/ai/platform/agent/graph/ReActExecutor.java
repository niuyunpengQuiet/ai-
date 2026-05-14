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
public class ReActExecutor implements GraphExecutor {

    private final AgentMetrics agentMetrics;

    @Override
    public String getPatternCode() {
        return OrchestrationPattern.REACT.getCode();
    }

    @Override
    public OrchestrationResponse execute(OrchestrationRequest request) {
        long start = System.currentTimeMillis();

        OrchestrationResponse response = new OrchestrationResponse();
        response.setRoutedAgentId("agt-react");

        List<OrchestrationResponse.StepTrace> steps = new ArrayList<>();
        List<OrchestrationResponse.SkillTrace> skillTraces = new ArrayList<>();

        // Step 1: Thought
        OrchestrationResponse.StepTrace s1 = new OrchestrationResponse.StepTrace();
        s1.setStep("1");
        s1.setAction("Thought: 分析用户意图");
        s1.setObservation("识别为法务咨询类问题");
        steps.add(s1);

        // Step 2: Action - invoke skill plugin
        OrchestrationResponse.StepTrace s2 = new OrchestrationResponse.StepTrace();
        s2.setStep("2");
        s2.setAction("Action: SearchTool(\"刑法 XXX条\")");
        s2.setObservation("检索到 3 条相关文档");
        steps.add(s2);

        // Record skill invocation trace
        OrchestrationResponse.SkillTrace skillTrace = new OrchestrationResponse.SkillTrace();
        skillTrace.setSkillId("elasticsearch-search");
        skillTrace.setSkillName("Elasticsearch 全文检索");
        skillTrace.setPluginId("elasticsearch-search");
        skillTrace.setSuccess(true);
        skillTrace.setDurationMs(120);
        skillTrace.setSummary("检索到 3 条相关文档");
        skillTraces.add(skillTrace);

        // Step 3: Observation -> Final
        OrchestrationResponse.StepTrace s3 = new OrchestrationResponse.StepTrace();
        s3.setStep("3");
        s3.setAction("Thought: 综合分析");
        s3.setObservation("生成最终回答");
        steps.add(s3);

        response.setContent("[ReAct] 通过 Thought-Action-Observation 循环完成推理。");
        response.setCotTrace("Thought -> Action(SearchTool) -> Observation -> Final");
        response.setSteps(steps);
        response.setSkillTraces(skillTraces);

        long duration = System.currentTimeMillis() - start;
        agentMetrics.recordOrchestration(duration, 200);
        agentMetrics.recordSkillInvocation();
        agentMetrics.recordPluginExecution(120, true);
        return response;
    }
}