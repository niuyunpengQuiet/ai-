package com.ai.platform.observability.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
@Getter
public class AgentMetrics {

    private final Counter orchestrationTotal;
    private final Counter tokenConsumption;
    private final Timer orchestrationLatency;
    private final Counter skillInvocationTotal;
    private final Counter ragQueryTotal;

    // PF4J Plugin Metrics
    private final Counter pluginLoadTotal;
    private final Counter pluginStartTotal;
    private final Counter pluginErrorTotal;
    private final Timer pluginExecutionLatency;
    private final AtomicInteger pluginLoadedCount;
    private final AtomicInteger pluginStartedCount;

    public AgentMetrics(MeterRegistry registry) {
        this.orchestrationTotal = Counter.builder("agent.orchestration.total")
                .description("Total number of orchestration executions")
                .register(registry);

        this.tokenConsumption = Counter.builder("agent.token.consumption")
                .description("Total token consumption across all agents")
                .register(registry);

        this.orchestrationLatency = Timer.builder("agent.orchestration.latency")
                .description("Orchestration execution latency")
                .register(registry);

        this.skillInvocationTotal = Counter.builder("agent.skill.invocation.total")
                .description("Total number of skill invocations")
                .register(registry);

        this.ragQueryTotal = Counter.builder("agent.rag.query.total")
                .description("Total number of RAG queries")
                .register(registry);

        // PF4J Plugin Metrics
        this.pluginLoadTotal = Counter.builder("plugin.load.total")
                .description("Total number of plugin load attempts")
                .register(registry);

        this.pluginStartTotal = Counter.builder("plugin.start.total")
                .description("Total number of plugin start attempts")
                .register(registry);

        this.pluginErrorTotal = Counter.builder("plugin.error.total")
                .description("Total number of plugin execution errors")
                .register(registry);

        this.pluginExecutionLatency = Timer.builder("plugin.execution.latency")
                .description("Plugin execution latency")
                .register(registry);

        this.pluginLoadedCount = new AtomicInteger(0);
        Gauge.builder("plugin.loaded.count", pluginLoadedCount, AtomicInteger::get)
                .description("Number of currently loaded plugins")
                .register(registry);

        this.pluginStartedCount = new AtomicInteger(0);
        Gauge.builder("plugin.started.count", pluginStartedCount, AtomicInteger::get)
                .description("Number of currently started plugins")
                .register(registry);
    }

    public void recordOrchestration(long durationMs, long tokens) {
        orchestrationTotal.increment();
        orchestrationLatency.record(java.time.Duration.ofMillis(durationMs));
        tokenConsumption.increment(tokens);
    }

    public void recordSkillInvocation() {
        skillInvocationTotal.increment();
    }

    public void recordRagQuery() {
        ragQueryTotal.increment();
    }

    public void recordPluginLoad(int loaded, int started) {
        pluginLoadTotal.increment();
        pluginStartTotal.increment(started);
        pluginLoadedCount.set(loaded);
        pluginStartedCount.set(started);
    }

    public void recordPluginExecution(long durationMs, boolean success) {
        pluginExecutionLatency.record(java.time.Duration.ofMillis(durationMs));
        if (!success) {
            pluginErrorTotal.increment();
        }
    }
}