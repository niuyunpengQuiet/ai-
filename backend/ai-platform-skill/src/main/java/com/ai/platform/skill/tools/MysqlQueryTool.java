package com.ai.platform.skill.tools;

import com.ai.platform.sdk.SkillContext;
import com.ai.platform.sdk.SkillExtension;
import com.ai.platform.sdk.SkillResult;
import org.pf4j.Extension;

import java.util.Map;

@Extension
public class MysqlQueryTool implements SkillExtension {

    @Override
    public String getSkillId() {
        return "mysql-query";
    }

    @Override
    public String getSkillName() {
        return "MySQL/Doris 数据查询";
    }

    @Override
    public String getDescription() {
        return "对 Doris 分析库执行 SQL 查询，返回结构化结果集";
    }

    @Override
    public SkillResult execute(SkillContext context) {
        return SkillResult.ok(Map.of(
                "rows", 10,
                "columns", "[模拟] id, name, amount, date",
                "query", context.getInput()
        ));
    }
}