package com.ai.platform.rag.model;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_document_chunk")
public class DocumentChunk {

    @TableId(type = IdType.ASSIGN_ID)
    private String id;

    private String knowledgeBaseId;

    private String templateType;

    private String content;

    private String metadata;

    private LocalDateTime createdAt;
}