package com.ai.platform.chat.model;

import com.ai.platform.common.enums.InteractionMode;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.Map;

@Data
public class ChatRequest {

    @NotBlank(message = "消息内容不能为空")
    private String message;

    private InteractionMode mode = InteractionMode.STREAM;

    /** agentId -> weight (1-100) */
    private Map<String, Integer> agentWeights;
}