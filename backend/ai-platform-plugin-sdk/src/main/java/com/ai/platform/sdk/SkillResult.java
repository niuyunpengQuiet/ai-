package com.ai.platform.sdk;

import lombok.Data;

@Data
public class SkillResult {

    private boolean success;

    private Object data;

    private String error;

    private String pluginId;

    private long durationMs;

    public static SkillResult ok(Object data) {
        SkillResult r = new SkillResult();
        r.setSuccess(true);
        r.setData(data);
        return r;
    }

    public static SkillResult ok(Object data, String pluginId, long durationMs) {
        SkillResult r = ok(data);
        r.setPluginId(pluginId);
        r.setDurationMs(durationMs);
        return r;
    }

    public static SkillResult fail(String error) {
        SkillResult r = new SkillResult();
        r.setSuccess(false);
        r.setError(error);
        return r;
    }
}