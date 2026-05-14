package com.ai.platform.agent.model;

import com.ai.platform.common.enums.AgentRole;
import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName(value = "t_agent_config", autoResultMap = true)
public class AgentConfig {

    @TableId(type = IdType.ASSIGN_ID)
    private String id;

    private String name;

    @EnumValue
    private AgentRole role;

    private String model;

    private Double temperature;

    private Integer maxSteps;

    private String fallbackAgentId;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> skillIds;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<String> knowledgeBaseIds;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}