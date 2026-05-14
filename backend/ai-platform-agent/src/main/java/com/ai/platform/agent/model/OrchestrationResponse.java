package com.ai.platform.agent.model;

import lombok.Data;
import java.util.List;

@Data
public class OrchestrationResponse {

    private String content;

    private String cotTrace;

    private String routedAgentId;

    private List<StepTrace> steps;

    /** Skill/plugin invocation traces from this orchestration run */
    private List<SkillTrace> skillTraces;

    @Data
    public static class StepTrace {
        private String step;
        private String action;
        private String observation;
    }

    @Data
    public static class SkillTrace {
        private String skillId;
        private String skillName;
        private String pluginId;
        private boolean success;
        private long durationMs;
        private String summary;
    }
}