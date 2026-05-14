package com.ai.platform.rag.chunk;

import java.util.List;

public interface ChunkStrategy {

    String getType();

    List<String> chunk(String content);
}