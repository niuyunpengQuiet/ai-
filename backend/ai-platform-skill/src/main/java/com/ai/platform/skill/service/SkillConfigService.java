package com.ai.platform.skill.service;

import com.ai.platform.common.exception.BizException;
import com.ai.platform.common.utils.RedisUtils;
import com.ai.platform.skill.model.SkillConfig;
import com.ai.platform.skill.model.SkillConfigDTO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class SkillConfigService extends ServiceImpl<SkillConfigMapper, SkillConfig> {

    private final RedisUtils redisUtils;

    private static final String CACHE_KEY_PREFIX = "skill:config:";
    private static final String CACHE_LIST_KEY = "skill:config:list";
    private static final long CACHE_TTL_HOURS = 2;

    public List<SkillConfig> listAll() {
        Object cached = redisUtils.get(CACHE_LIST_KEY);
        if (cached != null) {
            return (List<SkillConfig>) cached;
        }
        List<SkillConfig> list = list();
        redisUtils.set(CACHE_LIST_KEY, list, CACHE_TTL_HOURS, TimeUnit.HOURS);
        return list;
    }

    public SkillConfig getById(String id) {
        String cacheKey = CACHE_KEY_PREFIX + id;
        SkillConfig cached = redisUtils.get(cacheKey, SkillConfig.class);
        if (cached != null) {
            return cached;
        }
        SkillConfig config = super.getById(id);
        if (config == null) {
            throw new BizException(404, "技能不存在: " + id);
        }
        redisUtils.set(cacheKey, config, CACHE_TTL_HOURS, TimeUnit.HOURS);
        return config;
    }

    public SkillConfig create(SkillConfigDTO dto) {
        SkillConfig config = new SkillConfig();
        config.setName(dto.getName());
        config.setPluginId(dto.getPluginId());
        config.setSkillType(dto.getSkillType());
        config.setProvider(dto.getProvider());
        config.setAuthType(dto.getAuthType());
        config.setEndpoint(dto.getEndpoint());
        config.setStatus("active");
        config.setCreatedAt(LocalDateTime.now());
        config.setUpdatedAt(LocalDateTime.now());
        save(config);
        evictCache(config.getId());
        return config;
    }

    public SkillConfig update(String id, SkillConfigDTO dto) {
        SkillConfig config = getById(id);
        config.setName(dto.getName());
        config.setPluginId(dto.getPluginId());
        config.setSkillType(dto.getSkillType());
        config.setProvider(dto.getProvider());
        config.setAuthType(dto.getAuthType());
        config.setEndpoint(dto.getEndpoint());
        config.setUpdatedAt(LocalDateTime.now());
        updateById(config);
        evictCache(id);
        return config;
    }

    public void delete(String id) {
        getById(id);
        removeById(id);
        evictCache(id);
    }

    private void evictCache(String id) {
        redisUtils.delete(CACHE_KEY_PREFIX + id);
        redisUtils.delete(CACHE_LIST_KEY);
    }
}