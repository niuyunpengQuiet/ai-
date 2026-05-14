package com.ai.platform.observability.langfuse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class LangfuseService {

    private final LangfuseConfig langfuseConfig;

    public void trace(String traceId, String name, String input, String output, Map<String, Object> metadata) {
        if (!langfuseConfig.isEnabled()) {
            return;
        }
        // TODO: integrate with Langfuse SDK
        log.info("[Langfuse] traceId={}, name={}, metadata={}", traceId, name, metadata);
    }

    public void span(String traceId, String spanId, String name, String input, String output) {
        if (!langfuseConfig.isEnabled()) {
            return;
        }
        log.info("[Langfuse] span: traceId={}, spanId={}, name={}", traceId, spanId, name);
    }
}