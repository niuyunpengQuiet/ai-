package com.ai.platform.chat.service;

import com.ai.platform.agent.graph.OrchestrationEngine;
import com.ai.platform.agent.model.OrchestrationRequest;
import com.ai.platform.agent.model.OrchestrationResponse;
import com.ai.platform.chat.model.*;
import com.ai.platform.chat.sse.SseEmitter;
import com.ai.platform.common.enums.InteractionMode;
import com.ai.platform.common.enums.OrchestrationPattern;
import com.ai.platform.common.utils.RedisUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final OrchestrationEngine orchestrationEngine;
    private final RedisUtils redisUtils;

    private static final String SESSION_KEY_PREFIX = "chat:session:";
    private static final long SESSION_TTL_HOURS = 24;

    public ChatSession getOrCreateSession(String sessionId) {
        String cacheKey = SESSION_KEY_PREFIX + sessionId;
        ChatSession cached = redisUtils.get(cacheKey, ChatSession.class);
        if (cached != null) {
            return cached;
        }

        ChatSession session = new ChatSession();
        session.setSessionId(sessionId);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        session.getMessages().add(ChatMessage.system("交互工作台已就绪。支持多智能体节点同时挂载（MoE路由）。"));

        redisUtils.set(cacheKey, session, SESSION_TTL_HOURS, TimeUnit.HOURS);
        return session;
    }

    private void saveSession(ChatSession session) {
        String cacheKey = SESSION_KEY_PREFIX + session.getSessionId();
        redisUtils.set(cacheKey, session, SESSION_TTL_HOURS, TimeUnit.HOURS);
    }

    public ChatMessage chatSync(String sessionId, ChatRequest request) {
        ChatSession session = getOrCreateSession(sessionId);
        session.addUserMessage(request.getMessage());

        OrchestrationRequest orchestrationReq = new OrchestrationRequest();
        orchestrationReq.setUserInput(request.getMessage());
        orchestrationReq.setPattern(OrchestrationPattern.ROUTER_MOE);
        orchestrationReq.setMode(request.getMode());
        orchestrationReq.setAgentWeights(request.getAgentWeights());

        OrchestrationResponse response = orchestrationEngine.execute(orchestrationReq);

        ChatMessage agentMsg = ChatMessage.agent(response.getContent(), response.getRoutedAgentId());
        agentMsg.setCotTrace(response.getCotTrace());

        // Attach skill/plugin invocation traces for frontend visualization
        if (response.getSkillTraces() != null) {
            agentMsg.setSkillTraces(response.getSkillTraces().stream()
                    .map(st -> {
                        ChatMessage.SkillTrace trace = new ChatMessage.SkillTrace();
                        trace.setSkillId(st.getSkillId());
                        trace.setSkillName(st.getSkillName());
                        trace.setPluginId(st.getPluginId());
                        trace.setSuccess(st.isSuccess());
                        trace.setDurationMs(st.getDurationMs());
                        trace.setSummary(st.getSummary());
                        return trace;
                    })
                    .collect(Collectors.toList()));
        }

        session.getMessages().add(agentMsg);
        saveSession(session);

        return agentMsg;
    }

    public Flux<ChatMessage> chatStream(String sessionId, ChatRequest request) {
        ChatSession session = getOrCreateSession(sessionId);
        session.addUserMessage(request.getMessage());
        saveSession(session);

        SseEmitter emitter = new SseEmitter();

        new Thread(() -> {
            try {
                OrchestrationRequest orchestrationReq = new OrchestrationRequest();
                orchestrationReq.setUserInput(request.getMessage());
                orchestrationReq.setPattern(OrchestrationPattern.ROUTER_MOE);
                orchestrationReq.setMode(request.getMode());
                orchestrationReq.setAgentWeights(request.getAgentWeights());

                OrchestrationResponse response = orchestrationEngine.execute(orchestrationReq);
                String fullContent = response.getContent();
                int chunkSize = 3;

                for (int i = 0; i < fullContent.length(); i += chunkSize) {
                    String chunk = fullContent.substring(i, Math.min(i + chunkSize, fullContent.length()));
                    ChatMessage msg = ChatMessage.agent(chunk, response.getRoutedAgentId());
                    if (i == 0 && request.getMode() == InteractionMode.COT) {
                        msg.setCotTrace(response.getCotTrace());
                    }
                    // Attach skill traces on first chunk so frontend can visualize plugin calls
                    if (i == 0 && response.getSkillTraces() != null) {
                        msg.setSkillTraces(response.getSkillTraces().stream()
                                .map(st -> {
                                    ChatMessage.SkillTrace trace = new ChatMessage.SkillTrace();
                                    trace.setSkillId(st.getSkillId());
                                    trace.setSkillName(st.getSkillName());
                                    trace.setPluginId(st.getPluginId());
                                    trace.setSuccess(st.isSuccess());
                                    trace.setDurationMs(st.getDurationMs());
                                    trace.setSummary(st.getSummary());
                                    return trace;
                                })
                                .collect(Collectors.toList()));
                    }
                    emitter.emit(msg);
                    Thread.sleep(30);
                }

                // Save final session state
                session.addAgentMessage(fullContent, response.getRoutedAgentId());
                saveSession(session);

                emitter.complete();
            } catch (Exception e) {
                log.error("Stream error", e);
                emitter.complete();
            }
        }).start();

        return emitter.asFlux();
    }
}