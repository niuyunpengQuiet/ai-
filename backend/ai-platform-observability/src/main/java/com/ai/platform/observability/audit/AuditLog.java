package com.ai.platform.observability.audit;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_audit_log")
public class AuditLog {

    @TableId(type = IdType.ASSIGN_ID)
    private String id;

    private String traceId;

    private String sessionId;

    private String agentId;

    private String pattern;

    private String action;

    private String inputHash;

    private String outputHash;

    private Long durationMs;

    private Long tokenCount;

    /** PF4J plugin ID involved in this action */
    private String pluginId;

    /** Skill ID invoked */
    private String skillId;

    /** Whether skill invocation succeeded */
    private Boolean skillSuccess;

    /** Skill invocation duration in ms */
    private Long skillDurationMs;

    private String status;

    private LocalDateTime createdAt;
}