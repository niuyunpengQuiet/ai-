package com.ai.platform.rag.store;

import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
public class VectorStoreFactory {

    private final Map<String, EmbeddingStore<?>> storeMap;

    public VectorStoreFactory(Map<String, EmbeddingStore<?>> storeMap) {
        this.storeMap = storeMap;
    }

    public EmbeddingStore<?> getStore(String vectorDb) {
        EmbeddingStore<?> store = storeMap.get(vectorDb + "EmbeddingStore");
        if (store == null) {
            throw new RuntimeException("不支持的向量数据库: " + vectorDb);
        }
        return store;
    }
}