package com.ai.platform.rag.model;

import lombok.Data;
import java.util.List;

@Data
public class RagResult {

    private String knowledgeBaseId;

    private List<MatchedChunk> matches;

    @Data
    public static class MatchedChunk {
        private String chunkId;
        private String content;
        private Double score;
        private String metadata;
    }
}