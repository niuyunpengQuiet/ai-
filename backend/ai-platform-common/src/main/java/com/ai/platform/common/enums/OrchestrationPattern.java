package com.ai.platform.common.enums;

import lombok.Getter;

@Getter
public enum OrchestrationPattern {
    ROUTER_MOE("router-moe", "基于路由的混合专家"),
    REACT("react", "ReAct推理执行闭环"),
    PLAN_AND_SOLVE("plan-solve", "Plan-and-Solve调度"),
    HIERARCHICAL("hierarchical", "层级化多智能体");

    private final String code;
    private final String desc;

    OrchestrationPattern(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}