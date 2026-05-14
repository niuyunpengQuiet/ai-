package com.ai.platform.common.enums;

import lombok.Getter;

@Getter
public enum InteractionMode {
    STREAM("stream", "流式输出"),
    SYNC("sync", "同步响应"),
    COT("cot", "带思维链推理");

    private final String code;
    private final String desc;

    InteractionMode(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}