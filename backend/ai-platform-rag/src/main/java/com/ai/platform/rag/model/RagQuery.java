package com.ai.platform.rag.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RagQuery {

    @NotBlank(message = "知识库ID不能为空")
    private String knowledgeBaseId;

    @NotBlank(message = "查询内容不能为空")
    private String query;

    private Integer topK = 5;

    private Double minScore = 0.7;
}