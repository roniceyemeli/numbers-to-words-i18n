import { defineConfig } from "tsdown";

// @ts-ignore
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"], // Order as ESM first
  dts: true, // Generates .d.ts and .d.cts files
  splitting: false, // Keep false for CJS; true can be set for ESM-specific
  sourcemap: true,
  clean: true,
  outDir: "dist", // Explicitly set the output directory
});