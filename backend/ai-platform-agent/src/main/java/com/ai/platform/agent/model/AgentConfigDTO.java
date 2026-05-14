package com.ai.platform.agent.model;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class AgentConfigDTO {

    private String id;

    @NotBlank(message = "智能体名称不能为空")
    private String name;

    @NotNull(message = "角色不能为空")
    private String role;

    @NotBlank(message = "底层模型不能为空")
    private String model;

    @DecimalMin(value = "0.0") @DecimalMax(value = "2.0")
    private Double temperature = 0.5;

    @Min(1) @Max(100)
    private Integer maxSteps = 5;

    private String fallbackAgentId;

    private List<String> skillIds;

    private List<String> knowledgeBaseIds;
}