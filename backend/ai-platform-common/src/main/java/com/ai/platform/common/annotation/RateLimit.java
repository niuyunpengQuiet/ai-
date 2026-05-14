package com.ai.platform.common.annotation;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

/**
 * 限流注解 — 基于 Redis + Lua 脚本实现令牌桶
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RateLimit {

    /** 限流 key 前缀 */
    String key() default "rate_limit";

    /** 时间窗口内最大请求数 */
    int permits() default 10;

    /** 时间窗口大小 */
    long period() default 1;

    /** 时间单位 */
    TimeUnit timeUnit() default TimeUnit.SECONDS;
}