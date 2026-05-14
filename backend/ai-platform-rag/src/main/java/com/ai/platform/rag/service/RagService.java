package com.ai.platform.rag.service;

import com.ai.platform.rag.model.KnowledgeBase;
import com.ai.platform.rag.model.RagQuery;
import com.ai.platform.rag.model.RagResult;
import com.ai.platform.rag.store.VectorStoreFactory;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingMatch;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RagService {

    private final VectorStoreFactory vectorStoreFactory;
    private final EmbeddingModel embeddingModel;
    private final KnowledgeBaseService knowledgeBaseService;

    public RagResult search(RagQuery query) {
        KnowledgeBase kb = knowledgeBaseService.getById(query.getKnowledgeBaseId());
        if (kb == null) {
            throw new RuntimeException("知识库不存在: " + query.getKnowledgeBaseId());
        }

        EmbeddingStore<TextSegment> store = (EmbeddingStore<TextSegment>) vectorStoreFactory.getStore(kb.getVectorDb());
        Embedding queryEmbedding = embeddingModel.embed(query.getQuery()).content();

        List<EmbeddingMatch<TextSegment>> matches = store.findRelevant(queryEmbedding, query.getTopK(), query.getMinScore());

        RagResult result = new RagResult();
        result.setKnowledgeBaseId(query.getKnowledgeBaseId());
        result.setMatches(matches.stream().map(m -> {
            RagResult.MatchedChunk mc = new RagResult.MatchedChunk();
            mc.setChunkId(m.embeddingId());
            mc.setContent(m.embedded().text());
            mc.setScore(m.score());
            return mc;
        }).toList());

        return result;
    }
}