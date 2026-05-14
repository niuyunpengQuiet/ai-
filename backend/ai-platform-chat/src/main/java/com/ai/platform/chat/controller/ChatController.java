package com.ai.platform.chat.controller;

import com.ai.platform.chat.model.ChatMessage;
import com.ai.platform.chat.model.ChatRequest;
import com.ai.platform.chat.service.ChatService;
import com.ai.platform.common.annotation.RateLimit;
import com.ai.platform.common.enums.InteractionMode;
import com.ai.platform.common.result.R;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @RateLimit(key = "chat_sync", permits = 20, period = 1)
    @PostMapping("/sync")
    public R<ChatMessage> chatSync(@RequestHeader("X-Session-Id") String sessionId,
                                    @RequestBody ChatRequest request) {
        if (request.getMode() == null) {
            request.setMode(InteractionMode.SYNC);
        }
        return R.ok(chatService.chatSync(sessionId, request));
    }

    @RateLimit(key = "chat_stream", permits = 10, period = 1)
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ChatMessage> chatStream(@RequestHeader("X-Session-Id") String sessionId,
                                         @RequestBody ChatRequest request) {
        if (request.getMode() == null) {
            request.setMode(InteractionMode.STREAM);
        }
        return chatService.chatStream(sessionId, request);
    }
}