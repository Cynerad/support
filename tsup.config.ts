import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "number/index": "src/support/number/index.ts",
    "string/index": "src/support/string/index.ts",
    "array/index": "src/support/array/index.ts",
    "benchmark/index": "src/support/benchmark/index.ts",
    "cookies/index": "src/support/cookies/index.ts",
    "fetch/index": "src/support/fetch/index.ts",
    "file-system/index": "src/support/file-system/index.ts",
    "format/index": "src/support/format/index.ts",
    "hash/index": "src/support/hash/index.ts",
    "object/index": "src/support/object/index.ts",
    "path/index": "src/support/path/index.ts",
    "utils/index": "src/support/utils/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
});
