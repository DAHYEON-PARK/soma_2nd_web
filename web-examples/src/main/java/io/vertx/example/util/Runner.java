package io.vertx.example.util;

import io.vertx.core.DeploymentOptions;

public class Runner {

  private static final String WEB_EXAMPLES_DIR = "web-examples";
  private static final String WEB_EXAMPLES_JAVA_DIR = WEB_EXAMPLES_DIR + "/src/main/java/";

  public static void runClusteredExample(Class clazz) {
    ExampleRunner.runJavaExample(WEB_EXAMPLES_JAVA_DIR, clazz, true);
  }

  public static void runExample(Class clazz) {
    ExampleRunner.runJavaExample(WEB_EXAMPLES_JAVA_DIR, clazz, false);
  }

  public static void runExample(Class clazz, DeploymentOptions options) {
    ExampleRunner.runJavaExample(WEB_EXAMPLES_JAVA_DIR, clazz, options);
  }
}
