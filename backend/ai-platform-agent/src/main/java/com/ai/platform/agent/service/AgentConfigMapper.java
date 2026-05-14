package com.ai.platform.agent.service;

import com.ai.platform.agent.model.AgentConfig;
import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@DS("dm")
public interface AgentConfigMapper extends BaseMapper<AgentConfig> {
}