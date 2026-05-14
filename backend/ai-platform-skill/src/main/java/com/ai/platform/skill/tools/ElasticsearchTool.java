package com.ai.platform.skill.tools;

import com.ai.platform.sdk.SkillContext;
import com.ai.platform.sdk.SkillExtension;
import com.ai.platform.sdk.SkillResult;
import org.pf4j.Extension;

import java.util.Map;

@Extension
public class ElasticsearchTool implements SkillExtension {

    @Override
    public String getSkillId() {
        return "elasticsearch-search";
    }

    @Override
    public String getSkillName() {
        return "Elasticsearch 全文检索";
    }

    @Override
    public String getDescription() {
        return "对案件卷宗、通讯记录等进行全文检索与聚合分析";
    }

    @Override
    public SkillResult execute(SkillContext context) {
        return SkillResult.ok(Map.of(
                "hits", 3,
                "results", "[模拟] 返回3条匹配记录",
                "query", context.getInput()
        ));
    }
}