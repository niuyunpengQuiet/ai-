package com.ai.platform.chat.sse;

import com.ai.platform.chat.model.ChatMessage;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

public class SseEmitter {

    private final Sinks.Many<ChatMessage> sink = Sinks.many().multicast().onBackpressureBuffer();

    public void emit(ChatMessage message) {
        sink.tryEmitNext(message);
    }

    public void complete() {
        sink.tryEmitComplete();
    }

    public Flux<ChatMessage> asFlux() {
        return sink.asFlux();
    }
}