package com.ai.platform.rag.controller;

import com.ai.platform.common.result.R;
import com.ai.platform.rag.model.KnowledgeBase;
import com.ai.platform.rag.model.KnowledgeBaseDTO;
import com.ai.platform.rag.model.RagQuery;
import com.ai.platform.rag.model.RagResult;
import com.ai.platform.rag.service.KnowledgeBaseService;
import com.ai.platform.rag.service.RagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/knowledge-bases")
@RequiredArgsConstructor
public class KnowledgeBaseController {

    private final KnowledgeBaseService knowledgeBaseService;
    private final RagService ragService;

    @GetMapping
    public R<List<KnowledgeBase>> list() {
        return R.ok(knowledgeBaseService.listAll());
    }

    @PostMapping
    public R<KnowledgeBase> create(@Valid @RequestBody KnowledgeBaseDTO dto) {
        return R.ok(knowledgeBaseService.create(dto));
    }

    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable String id) {
        knowledgeBaseService.delete(id);
        return R.ok();
    }

    @PostMapping("/{id}/ingest")
    public R<Void> ingest(@PathVariable String id,
                          @RequestParam String templateType,
                          @RequestBody String content) {
        knowledgeBaseService.ingestDocument(id, templateType, content);
        return R.ok();
    }

    @PostMapping("/search")
    public R<RagResult> search(@Valid @RequestBody RagQuery query) {
        return R.ok(ragService.search(query));
    }
}