# PF4J 插件开发指南

## 1. 架构概述

```
┌──────────────────────────────────────────────┐
│              PF4J Host (ai-platform-skill)    │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │PluginManager  │  │   SkillRegistry      │  │
│  │Config         │  │   (查找 SkillExtension)│  │
│  └──────────────┘  └──────────────────────┘  │
│         ▲                    ▲                 │
│         │ 加载/启动           │ 查找扩展         │
├─────────┼────────────────────┼─────────────────┤
│         │                    │                 │
│  ┌──────┴────────────────────┴──────────────┐ │
│  │         Plugin JAR (独立打包)              │ │
│  │  ┌──────────────────────────────────────┐│ │
│  │  │ @Extension class MySkill              ││ │
│  │  │   implements SkillExtension          ││ │
│  │  └──────────────────────────────────────┘│ │
│  └─────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

**关键约束**：插件 JAR 必须依赖 `ai-platform-plugin-sdk`，宿主与插件通过 SDK 接口解耦。

---

## 2. 创建新插件

### 2.1 新建 Maven 项目

```xml
<project>
    <groupId>com.ai.platform</groupId>
    <artifactId>skill-my-plugin</artifactId>
    <version>1.0.0</version>

    <dependencies>
        <dependency>
            <groupId>com.ai.platform</groupId>
            <artifactId>ai-platform-plugin-sdk</artifactId>
            <version>1.0.0-SNAPSHOT</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <configuration>
                    <archive>
                        <manifestEntries>
                            <Plugin-Id>my-plugin</Plugin-Id>
                            <Plugin-Version>1.0.0</Plugin-Version>
                            <Plugin-Provider>AI Platform</Plugin-Provider>
                            <Plugin-Class>com.ai.platform.skill.my.MyPlugin</Plugin-Class>
                        </manifestEntries>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.2 实现 Plugin 入口

```java
package com.ai.platform.skill.my;

import org.pf4j.Plugin;
import org.pf4j.PluginWrapper;

public class MyPlugin extends Plugin {

    public MyPlugin(PluginWrapper wrapper) {
        super(wrapper);
    }

    @Override
    public void start() {
        // 初始化资源：连接池、HTTP Client 等
    }

    @Override
    public void stop() {
        // 释放资源
    }
}
```

### 2.3 实现 SkillExtension

```java
package com.ai.platform.skill.my;

import com.ai.platform.sdk.SkillContext;
import com.ai.platform.sdk.SkillExtension;
import com.ai.platform.sdk.SkillResult;
import org.pf4j.Extension;

@Extension
public class MySkill implements SkillExtension {

    @Override
    public String getSkillId() {
        return "my-skill";
    }

    @Override
    public String getSkillName() {
        return "我的自定义技能";
    }

    @Override
    public String getDescription() {
        return "执行自定义业务逻辑";
    }

    @Override
    public SkillResult execute(SkillContext context) {
        long start = System.currentTimeMillis();
        try {
            // 1. 从 context 获取参数
            String input = context.getInput();
            Map<String, Object> params = context.getParams();
            Map<String, String> authConfig = context.getAuthConfig();

            // 2. 执行业务逻辑
            Object result = doBusinessLogic(input, params, authConfig);

            // 3. 返回结果（自动记录 pluginId 和 durationMs）
            return SkillResult.ok(result, getSkillId(),
                    System.currentTimeMillis() - start);
        } catch (Exception e) {
            return SkillResult.fail(e.getMessage());
        }
    }

    private Object doBusinessLogic(String input, Map<String, Object> params,
                                     Map<String, String> authConfig) {
        // 实际业务逻辑
        return Map.of("result", "处理完成", "input", input);
    }
}
```

---

## 3. 构建与部署

```bash
# 构建
mvn clean package

# 部署到宿主 plugins 目录
cp target/skill-my-plugin-1.0.0.jar /path/to/ai-platform/plugins/

# 热加载（无需重启）
curl -X POST http://localhost:8080/api/skills/plugins/reload
```

---

## 4. 注意事项

| 项目 | 说明 |
| :--- | :--- |
| **日志框架冲突** | 插件内不要引入 SLF4J 实现（logback 等），使用 `slf4j-api` 即可，宿主统一提供 |
| **依赖范围** | SDK 依赖必须 `scope=provided`，避免与宿主版本冲突 |
| **Spring Bean** | PF4J Spring 会自动扫描 `@Extension` 类并注册为 Bean，无需 `@Component` |
| **线程安全** | `SkillExtension.execute()` 可能被并发调用，必须保证线程安全 |
| **资源释放** | 在 `Plugin.stop()` 中关闭连接池、HTTP Client 等资源 |
| **向量库连接池** | Milvus/ES 连接池由宿主层统一管理，插件通过 SkillContext 获取配置自行创建轻量客户端 |

---

## 5. SkillContext 字段说明

| 字段 | 类型 | 来源 |
| :--- | :--- | :--- |
| `skillId` | String | 路由到该插件的技能 ID |
| `input` | String | 用户输入文本 |
| `params` | Map<String, Object> | 调用方传入的额外参数 |
| `authConfig` | Map<String, String> | 从 t_skill_config.auth_config 读取 |
| `endpoint` | String | 从 t_skill_config.endpoint 读取 |

---

## 6. SkillResult 字段说明

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `success` | boolean | 是否成功 |
| `data` | Object | 返回数据（任意 JSON 结构） |
| `error` | String | 错误信息 |
| `pluginId` | String | 由 SkillRegistry 自动填充 |
| `durationMs` | long | 由 SkillRegistry 自动填充 |