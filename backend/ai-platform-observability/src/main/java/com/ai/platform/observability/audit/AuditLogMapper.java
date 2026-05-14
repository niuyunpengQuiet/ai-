package com.ai.platform.observability.audit;

import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

@Mapper
@DS("doris")
public interface AuditLogMapper extends BaseMapper<AuditLog> {
}