package com.ai.platform.common.utils;

import com.ai.platform.common.annotation.RateLimit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class RateLimitAspect {

    private final StringRedisTemplate stringRedisTemplate;

    private static final String LUA_SCRIPT =
            "local key = KEYS[1]\n" +
            "local permits = tonumber(ARGV[1])\n" +
            "local period = tonumber(ARGV[2])\n" +
            "local current = tonumber(redis.call('get', key) or '0')\n" +
            "if current < permits then\n" +
            "  redis.call('incr', key)\n" +
            "  redis.call('expire', key, period)\n" +
            "  return 1\n" +
            "else\n" +
            "  return 0\n" +
            "end";

    @Around("@annotation(com.ai.platform.common.annotation.RateLimit)")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        RateLimit rateLimit = ((org.aspectj.lang.reflect.MethodSignature) joinPoint.getSignature())
                .getMethod().getAnnotation(RateLimit.class);

        String key = "rate_limit:" + rateLimit.key() + ":" + joinPoint.getSignature().toShortString();
        long periodSeconds = rateLimit.timeUnit().toSeconds(rateLimit.period());

        DefaultRedisScript<Long> script = new DefaultRedisScript<>(LUA_SCRIPT, Long.class);
        List<String> keys = Collections.singletonList(key);
        Long result = stringRedisTemplate.execute(script, keys,
                String.valueOf(rateLimit.permits()),
                String.valueOf(periodSeconds));

        if (result == null || result == 0L) {
            log.warn("Rate limit exceeded: key={}", key);
            throw new RuntimeException("请求过于频繁，请稍后重试");
        }

        return joinPoint.proceed();
    }
}