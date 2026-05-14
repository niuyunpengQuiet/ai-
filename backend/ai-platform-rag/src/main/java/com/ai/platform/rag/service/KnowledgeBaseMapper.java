package com.ai.platform.rag.service;

import com.ai.platform.rag.model.KnowledgeBase;
import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@DS("dm")
public interface KnowledgeBaseMapper extends BaseMapper<KnowledgeBase> {
}