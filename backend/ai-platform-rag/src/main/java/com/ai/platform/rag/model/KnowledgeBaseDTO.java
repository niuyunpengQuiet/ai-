package com.ai.platform.rag.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class KnowledgeBaseDTO {

    @NotBlank(message = "知识库名称不能为空")
    private String name;

    @NotBlank(message = "向量后端不能为空")
    private String vectorDb;

    @NotBlank(message = "Embedding模型不能为空")
    private String embeddingModel;

    private String chunkingStrategy;
}