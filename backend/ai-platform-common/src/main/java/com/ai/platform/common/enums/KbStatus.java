package com.ai.platform.common.enums;

import lombok.Getter;

@Getter
public enum KbStatus {
    ACTIVE("active", "就绪"),
    SYNCING("syncing", "向量化中"),
    ERROR("error", "异常");

    private final String code;
    private final String desc;

    KbStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}