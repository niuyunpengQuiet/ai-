package com.ai.platform.sdk;

import org.pf4j.ExtensionPoint;

import java.util.Map;

/**
 * PF4J ExtensionPoint for skill plugins.
 * Each plugin jar must implement this interface and register via @Extension.
 */
public interface SkillExtension extends ExtensionPoint {

    String getSkillId();

    String getSkillName();

    String getDescription();

    default String getVersion() {
        return "1.0.0";
    }

    SkillResult execute(SkillContext context);

    default void onStart() {}

    default void onStop() {}
}
