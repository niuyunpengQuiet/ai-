package com.ai.platform.skill.model;

import lombok.Data;

import java.util.Map;

@Data
public class SkillInvocation {

    private String skillId;

    private String input;

    private Map<String, Object> params;

    /** Optional: override auth config for this invocation */
    private Map<String, String> authConfig;

    /** Optional: override endpoint for this invocation */
    private String endpoint;
}