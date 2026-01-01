import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "number/index": "src/support/number/index.ts",
    "string/index": "src/support/string/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
});
