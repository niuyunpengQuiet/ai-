package com.ai.platform.rag.service;

import com.ai.platform.common.enums.KbStatus;
import com.ai.platform.common.exception.BizException;
import com.ai.platform.common.utils.RedisUtils;
import com.ai.platform.rag.chunk.ChunkStrategy;
import com.ai.platform.rag.model.*;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class KnowledgeBaseService extends ServiceImpl<KnowledgeBaseMapper, KnowledgeBase> {

    private final DocumentChunkMapper documentChunkMapper;
    private final List<ChunkStrategy> chunkStrategies;
    private final RedisUtils redisUtils;

    private static final String CACHE_KEY_PREFIX = "kb:";
    private static final String CACHE_LIST_KEY = "kb:list";
    private static final long CACHE_TTL_HOURS = 1;

    public List<KnowledgeBase> listAll() {
        Object cached = redisUtils.get(CACHE_LIST_KEY);
        if (cached != null) {
            return (List<KnowledgeBase>) cached;
        }
        List<KnowledgeBase> list = list();
        redisUtils.set(CACHE_LIST_KEY, list, CACHE_TTL_HOURS, TimeUnit.HOURS);
        return list;
    }

    public KnowledgeBase create(KnowledgeBaseDTO dto) {
        KnowledgeBase kb = new KnowledgeBase();
        kb.setName(dto.getName());
        kb.setVectorDb(dto.getVectorDb());
        kb.setEmbeddingModel(dto.getEmbeddingModel());
        kb.setDocCount(0);
        kb.setStatus(KbStatus.ACTIVE);
        kb.setCreatedAt(LocalDateTime.now());
        kb.setUpdatedAt(LocalDateTime.now());
        save(kb);
        evictCache(kb.getId());
        return kb;
    }

    public void ingestDocument(String kbId, String templateType, String content) {
        KnowledgeBase kb = getById(kbId);
        if (kb == null) {
            throw new BizException(404, "知识库不存在: " + kbId);
        }

        kb.setStatus(KbStatus.SYNCING);
        updateById(kb);

        ChunkStrategy strategy = chunkStrategies.stream()
                .filter(s -> s.getType().equals(templateType))
                .findFirst()
                .orElseThrow(() -> new BizException("不支持的模板类型: " + templateType));

        List<String> chunks = strategy.chunk(content);
        for (String chunk : chunks) {
            DocumentChunk dc = new DocumentChunk();
            dc.setKnowledgeBaseId(kbId);
            dc.setTemplateType(templateType);
            dc.setContent(chunk);
            dc.setCreatedAt(LocalDateTime.now());
            documentChunkMapper.insert(dc);
        }

        kb.setDocCount(kb.getDocCount() + chunks.size());
        kb.setStatus(KbStatus.ACTIVE);
        kb.setUpdatedAt(LocalDateTime.now());
        updateById(kb);
        evictCache(kbId);

        log.info("Ingested {} chunks into knowledge base {}", chunks.size(), kbId);
    }

    public void delete(String id) {
        KnowledgeBase kb = getById(id);
        if (kb == null) {
            throw new BizException(404, "知识库不存在: " + id);
        }
        documentChunkMapper.delete(new LambdaQueryWrapper<DocumentChunk>()
                .eq(DocumentChunk::getKnowledgeBaseId, id));
        removeById(id);
        evictCache(id);
    }

    private void evictCache(String id) {
        redisUtils.delete(CACHE_KEY_PREFIX + id);
        redisUtils.delete(CACHE_LIST_KEY);
    }
}