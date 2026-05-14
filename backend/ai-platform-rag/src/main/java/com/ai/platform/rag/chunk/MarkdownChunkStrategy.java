package com.ai.platform.rag.chunk;

import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class MarkdownChunkStrategy implements ChunkStrategy {

    @Override
    public String getType() {
        return "md";
    }

    @Override
    public List<String> chunk(String content) {
        return List.of(content.split("(?=\n# )"));
    }
}