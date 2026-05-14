package com.ai.platform.common.enums;

import lombok.Getter;

@Getter
public enum AgentRole {
    WORKER("Worker", "专家执行者"),
    ROUTER("Router", "意图路由器"),
    SUPERVISOR("Supervisor", "主管协调者");

    private final String code;
    private final String desc;

    AgentRole(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}