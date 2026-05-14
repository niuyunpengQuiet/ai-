package com.ai.platform.common.enums;

import lombok.Getter;

@Getter
public enum SkillStatus {
    ACTIVE("active", "已激活"),
    WARNING("warning", "警告"),
    INACTIVE("inactive", "未激活");

    private final String code;
    private final String desc;

    SkillStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}