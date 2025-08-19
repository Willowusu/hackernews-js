import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,       // allow describe/it/expect without imports
    environment: "node", // Hacker News API calls run in Node
    include: ["test/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json", "html"]
    }
  }
});
