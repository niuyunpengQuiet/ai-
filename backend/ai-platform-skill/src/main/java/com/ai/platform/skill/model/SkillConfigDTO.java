package com.ai.platform.skill.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SkillConfigDTO {

    @NotBlank(message = "技能名称不能为空")
    private String name;

    /** PF4J plugin ID that implements this skill */
    private String pluginId;

    @NotBlank(message = "技能类型不能为空")
    private String skillType;

    private String provider;

    private String authType;

    private String endpoint;
}