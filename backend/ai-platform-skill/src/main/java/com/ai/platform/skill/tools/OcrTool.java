package com.ai.platform.skill.tools;

import com.ai.platform.sdk.SkillContext;
import com.ai.platform.sdk.SkillExtension;
import com.ai.platform.sdk.SkillResult;
import org.pf4j.Extension;

import java.util.Map;

@Extension
public class OcrTool implements SkillExtension {

    @Override
    public String getSkillId() {
        return "ocr-extraction";
    }

    @Override
    public String getSkillName() {
        return "OCR 文档提取";
    }

    @Override
    public String getDescription() {
        return "从扫描件/照片中提取结构化文字，支持表格识别与版面分析";
    }

    @Override
    public SkillResult execute(SkillContext context) {
        return SkillResult.ok(Map.of(
                "extractedText", "[模拟OCR结果] 文档内容已提取",
                "pages", 5,
                "confidence", 0.92
        ));
    }
}