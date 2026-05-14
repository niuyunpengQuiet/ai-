package com.ai.platform.skill.service;

import com.ai.platform.skill.model.SkillConfig;
import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@DS("dm")
public interface SkillConfigMapper extends BaseMapper<SkillConfig> {
}