package com.ai.platform.agent.model;

import com.ai.platform.common.enums.InteractionMode;
import com.ai.platform.common.enums.OrchestrationPattern;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class OrchestrationRequest {

    @NotBlank(message = "用户输入不能为空")
    private String userInput;

    @NotNull(message = "编排模式不能为空")
    private OrchestrationPattern pattern;

    private InteractionMode mode = InteractionMode.STREAM;

    /** agentId -> weight (1-100) */
    private Map<String, Integer> agentWeights;
}