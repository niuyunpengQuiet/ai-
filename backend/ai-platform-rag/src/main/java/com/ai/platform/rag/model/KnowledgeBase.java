package com.ai.platform.rag.model;

import com.ai.platform.common.enums.KbStatus;
import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_knowledge_base")
public class KnowledgeBase {

    @TableId(type = IdType.ASSIGN_ID)
    private String id;

    private String name;

    private String vectorDb;

    private String embeddingModel;

    private Integer docCount;

    @EnumValue
    private KbStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}