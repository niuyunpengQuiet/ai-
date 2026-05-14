package com.ai.platform.rag.chunk;

import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class QaChunkStrategy implements ChunkStrategy {

    @Override
    public String getType() {
        return "qa";
    }

    @Override
    public List<String> chunk(String content) {
        return List.of(content.split("\n\n"));
    }
}