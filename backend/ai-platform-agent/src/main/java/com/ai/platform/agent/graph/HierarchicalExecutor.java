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
public class HierarchicalExecutor implements GraphExecutor {

    private final AgentMetrics agentMetrics;

    @Override
    public String getPatternCode() {
        return OrchestrationPattern.HIERARCHICAL.getCode();
    }

    @Override
    public OrchestrationResponse execute(OrchestrationRequest request) {
        long start = System.currentTimeMillis();

        OrchestrationResponse response = new OrchestrationResponse();
        response.setRoutedAgentId("agt-supervisor");

        List<OrchestrationResponse.StepTrace> steps = new ArrayList<>();
        List<OrchestrationResponse.SkillTrace> skillTraces = new ArrayList<>();

        // Supervisor delegates
        OrchestrationResponse.StepTrace s1 = new OrchestrationResponse.StepTrace();
        s1.setStep("1");
        s1.setAction("Supervisor: 分析并委派任务");
        s1.setObservation("委派至侦查梳理小队 + 法务审计小队");
        steps.add(s1);

        // Team 1: OCR plugin
        OrchestrationResponse.StepTrace s2 = new OrchestrationResponse.StepTrace();
        s2.setStep("2");
        s2.setAction("侦查小队: 取证专家执行OCR提取");
        s2.setObservation("提取到 5 页卷宗内容");
        steps.add(s2);

        OrchestrationResponse.SkillTrace ocrTrace = new OrchestrationResponse.SkillTrace();
        ocrTrace.setSkillId("ocr-extraction");
        ocrTrace.setSkillName("OCR 文档提取");
        ocrTrace.setPluginId("ocr-extraction");
        ocrTrace.setSuccess(true);
        ocrTrace.setDurationMs(800);
        ocrTrace.setSummary("提取到 5 页卷宗内容");
        skillTraces.add(ocrTrace);

        // Team 2: Chat clean plugin
        OrchestrationResponse.StepTrace s3 = new OrchestrationResponse.StepTrace();
        s3.setStep("3");
        s3.setAction("法务小队: 聊天记录清洗");
        s3.setObservation("清洗 42 条记录，替换 14 处黑话");
        steps.add(s3);

        OrchestrationResponse.SkillTrace cleanTrace = new OrchestrationResponse.SkillTrace();
        cleanTrace.setSkillId("chat-record-clean");
        cleanTrace.setSkillName("聊天记录清洗");
        cleanTrace.setPluginId("chat-record-clean");
        cleanTrace.setSuccess(true);
        cleanTrace.setDurationMs(200);
        cleanTrace.setSummary("清洗 42 条记录，替换 14 处黑话");
        skillTraces.add(cleanTrace);

        response.setContent("[Hierarchical] 主管已协调各小队完成委派任务。");
        response.setCotTrace("Supervisor -> Delegate(Team1,Team2) -> Aggregate");
        response.setSteps(steps);
        response.setSkillTraces(skillTraces);

        long duration = System.currentTimeMillis() - start;
        agentMetrics.recordOrchestration(duration, 250);
        agentMetrics.recordSkillInvocation();
        agentMetrics.recordSkillInvocation();
        agentMetrics.recordPluginExecution(800, true);
        agentMetrics.recordPluginExecution(200, true);
        return response;
    }
}