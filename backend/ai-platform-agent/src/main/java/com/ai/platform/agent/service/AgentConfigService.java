package com.ai.platform.agent.service;

import com.ai.platform.agent.model.AgentConfig;
import com.ai.platform.agent.model.AgentConfigDTO;
import com.ai.platform.common.enums.AgentRole;
import com.ai.platform.common.exception.BizException;
import com.ai.platform.common.utils.RedisUtils;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AgentConfigService extends ServiceImpl<AgentConfigMapper, AgentConfig> {

    private final RedisUtils redisUtils;

    private static final String CACHE_KEY_PREFIX = "agent:config:";
    private static final String CACHE_LIST_KEY = "agent:config:list";
    private static final long CACHE_TTL_HOURS = 2;

    public List<AgentConfig> listAll() {
        Object cached = redisUtils.get(CACHE_LIST_KEY);
        if (cached != null) {
            return (List<AgentConfig>) cached;
        }
        List<AgentConfig> list = list();
        redisUtils.set(CACHE_LIST_KEY, list, CACHE_TTL_HOURS, TimeUnit.HOURS);
        return list;
    }

    public AgentConfig getById(String id) {
        String cacheKey = CACHE_KEY_PREFIX + id;
        AgentConfig cached = redisUtils.get(cacheKey, AgentConfig.class);
        if (cached != null) {
            return cached;
        }
        AgentConfig config = super.getById(id);
        if (config == null) {
            throw new BizException(404, "智能体不存在: " + id);
        }
        redisUtils.set(cacheKey, config, CACHE_TTL_HOURS, TimeUnit.HOURS);
        return config;
    }

    public AgentConfig create(AgentConfigDTO dto) {
        AgentConfig config = new AgentConfig();
        config.setName(dto.getName());
        config.setRole(AgentRole.valueOf(dto.getRole().toUpperCase()));
        config.setModel(dto.getModel());
        config.setTemperature(dto.getTemperature());
        config.setMaxSteps(dto.getMaxSteps());
        config.setFallbackAgentId(dto.getFallbackAgentId());
        config.setSkillIds(dto.getSkillIds());
        config.setKnowledgeBaseIds(dto.getKnowledgeBaseIds());
        config.setCreatedAt(LocalDateTime.now());
        config.setUpdatedAt(LocalDateTime.now());
        save(config);
        evictCache(config.getId());
        return config;
    }

    public AgentConfig update(String id, AgentConfigDTO dto) {
        AgentConfig config = getById(id);
        config.setName(dto.getName());
        config.setRole(AgentRole.valueOf(dto.getRole().toUpperCase()));
        config.setModel(dto.getModel());
        config.setTemperature(dto.getTemperature());
        config.setMaxSteps(dto.getMaxSteps());
        config.setFallbackAgentId(dto.getFallbackAgentId());
        config.setSkillIds(dto.getSkillIds());
        config.setKnowledgeBaseIds(dto.getKnowledgeBaseIds());
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

    public List<AgentConfig> listByRole(AgentRole role) {
        return list(new LambdaQueryWrapper<AgentConfig>().eq(AgentConfig::getRole, role));
    }

    private void evictCache(String id) {
        redisUtils.delete(CACHE_KEY_PREFIX + id);
        redisUtils.delete(CACHE_LIST_KEY);
    }
}