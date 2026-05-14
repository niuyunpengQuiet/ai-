package com.ai.platform.chat.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Data
public class ChatSession {

    private String sessionId;

    private List<ChatMessage> messages = new ArrayList<>();

    private Map<String, Integer> agentWeights = new ConcurrentHashMap<>();

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public void addUserMessage(String content) {
        messages.add(ChatMessage.user(content));
        this.updatedAt = LocalDateTime.now();
    }

    public void addAgentMessage(String content, String agentId) {
        messages.add(ChatMessage.agent(content, agentId));
        this.updatedAt = LocalDateTime.now();
    }
}