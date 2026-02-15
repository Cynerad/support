import { expect, it } from "vitest";

import { appPath, basePath, fileName, folderName, publicPath } from ".";

it("will return base path (root of the project)", () => {
  expect(basePath()).toContain("\\");
  expect(basePath("benchmark")).toContain("benchmark");
  expect(basePath("///benchmark")).toContain("benchmark");
  expect(basePath("///benchmark/")).toContain("benchmark\\");
  expect(basePath("/benchmark/index.ts")).toContain("benchmark\\index.ts");
});

it("will return app path", () => {
  expect(appPath()).toContain("app");
  expect(appPath("dashboard")).toContain("app\\dashboard");
});

it("will return public path", () => {
  expect(publicPath()).toContain("public");
  expect(publicPath("image")).toContain("public\\image");
});

it("will access the file name form a path", () => {
  expect(fileName("/src/support/array/index.ts")).toBe("index.ts");
});

it("will not access the file name form a path and return empty string and error", () => {
  expect(fileName("/")).toBeFalsy();
});

it("will access the directory name form a path", () => {
  expect(folderName("src/support/array/")).toBe(basePath("src/support/array"));
  expect(folderName("src/support/array/index.ts")).toBe(basePath("src/support/array"));
});
