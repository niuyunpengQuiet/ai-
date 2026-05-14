package com.ai.platform.sdk;

import lombok.Data;

import java.util.Map;

@Data
public class SkillContext {

    private String skillId;

    private String input;

    private Map<String, Object> params;

    private Map<String, String> authConfig;

    private String endpoint;

    public static SkillContext of(String skillId, String input, Map<String, Object> params,
                                  Map<String, String> authConfig, String endpoint) {
        SkillContext ctx = new SkillContext();
        ctx.setSkillId(skillId);
        ctx.setInput(input);
        ctx.setParams(params);
        ctx.setAuthConfig(authConfig);
        ctx.setEndpoint(endpoint);
        return ctx;
    }
}
