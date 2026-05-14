package com.ai.platform.skill.model;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName(value = "t_skill_config", autoResultMap = true)
public class SkillConfig {

    private String id;

    private String name;

    /** PF4J plugin ID that provides this skill */
    private String pluginId;

    private String skillType;

    private String provider;

    private String authType;

    private String endpoint;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}