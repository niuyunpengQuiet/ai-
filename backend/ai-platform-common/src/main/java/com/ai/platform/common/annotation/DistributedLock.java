package com.ai.platform.common.annotation;

import java.lang.annotation.*;
import java.util.concurrent.TimeUnit;

/**
 * 分布式锁注解 — 基于 Redisson 实现
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface DistributedLock {

    /** 锁的 key，支持 SpEL: #id, #request.name 等 */
    String key();

    /** 等待获取锁的时间，默认 0 即不等待 */
    long waitTime() default 0;

    /** 锁持有时间 */
    long leaseTime() default 30;

    /** 时间单位 */
    TimeUnit timeUnit() default TimeUnit.SECONDS;
}