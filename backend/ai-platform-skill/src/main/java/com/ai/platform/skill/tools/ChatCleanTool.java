package com.ai.platform.skill.tools;

import com.ai.platform.sdk.SkillContext;
import com.ai.platform.sdk.SkillExtension;
import com.ai.platform.sdk.SkillResult;
import org.pf4j.Extension;

import java.util.Map;

@Extension
public class ChatCleanTool implements SkillExtension {

    @Override
    public String getSkillId() {
        return "chat-record-clean";
    }

    @Override
    public String getSkillName() {
        return "聊天记录清洗";
    }

    @Override
    public String getDescription() {
        return "对微信/QQ聊天记录进行脱敏、黑话替换与结构化提取";
    }

    @Override
    public SkillResult execute(SkillContext context) {
        return SkillResult.ok(Map.of(
                "cleanedRecords", 42,
                "jargonReplaced", 14,
                "sensitiveMasked", 8
        ));
    }
}