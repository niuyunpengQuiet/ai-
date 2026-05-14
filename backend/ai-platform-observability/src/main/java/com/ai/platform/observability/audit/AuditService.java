package com.ai.platform.observability.audit;

import com.ai.platform.observability.metrics.AgentMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AgentMetrics agentMetrics;

    public void logOrchestration(String traceId, String sessionId, String agentId, String pattern,
                                  long durationMs, long tokenCount, String status) {
        agentMetrics.recordOrchestration(durationMs, tokenCount);
        log.info("Audit: traceId={}, session={}, agent={}, pattern={}, duration={}ms, tokens={}, status={}",
                traceId, sessionId, agentId, pattern, durationMs, tokenCount, status);
    }

    public void logSkillInvocation(String traceId, String sessionId, String skillId, String pluginId,
                                     boolean success, long durationMs) {
        agentMetrics.recordSkillInvocation();
        agentMetrics.recordPluginExecution(durationMs, success);
        log.info("Audit: traceId={}, skill={}, plugin={}, success={}, duration={}ms",
                traceId, skillId, pluginId, success, durationMs);
    }
}