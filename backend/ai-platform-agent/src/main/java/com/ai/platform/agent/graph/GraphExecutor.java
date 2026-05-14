package com.ai.platform.agent.graph;

import com.ai.platform.agent.model.OrchestrationRequest;
import com.ai.platform.agent.model.OrchestrationResponse;

public interface GraphExecutor {

    String getPatternCode();

    OrchestrationResponse execute(OrchestrationRequest request);
}