package com.ai.platform.chat.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ChatMessage {

    private String role; // user, agent, system

    private String content;

    private String cotTrace;

    private String agentId;

    private LocalDateTime timestamp;

    /** Skill/plugin invocation trace for SSE visualization */
    private List<SkillTrace> skillTraces;

    @Data
    public static class SkillTrace {
        private String skillId;
        private String skillName;
        private String pluginId;
        private boolean success;
        private long durationMs;
        private String summary;
    }

    public static ChatMessage user(String content) {
        ChatMessage m = new ChatMessage();
        m.setRole("user");
        m.setContent(content);
        m.setTimestamp(LocalDateTime.now());
        return m;
    }

    public static ChatMessage agent(String content, String agentId) {
        ChatMessage m = new ChatMessage();
        m.setRole("agent");
        m.setContent(content);
        m.setAgentId(agentId);
        m.setTimestamp(LocalDateTime.now());
        return m;
    }

    public static ChatMessage system(String content) {
        ChatMessage m = new ChatMessage();
        m.setRole("system");
        m.setContent(content);
        m.setTimestamp(LocalDateTime.now());
        return m;
    }
}