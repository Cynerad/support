import path from "node:path";
import { expect, it } from "vitest";

import { appPath, basePath, fileName, folderName, publicPath } from ".";

it("will return base path (root of the project)", () => {
  expect(basePath()).toContain(path.sep);
  expect(basePath("benchmark")).toContain("benchmark");
  expect(basePath("///benchmark")).toContain("benchmark");

  expect(basePath("/benchmark/index.ts")).toBe(
    basePath(path.join("benchmark", "index.ts")),
  );
});

it("will return app path", () => {
  expect(appPath()).toContain("app");
  expect(appPath("dashboard")).toBe(
    basePath(path.join("app", "dashboard")),
  );
});

it("will return public path", () => {
  expect(publicPath()).toContain("public");
  expect(publicPath("image")).toBe(
    basePath(path.join("public", "image")),
  );
});

it("will access the file name from a path", () => {
  expect(fileName("/src/support/array/index.ts")).toBe("index.ts");
  expect(fileName(path.join("src", "support", "array", "index.ts"))).toBe("index.ts");
});

it("will not access the file name from a path and return empty string", () => {
  expect(fileName("/")).toBeFalsy();
  expect(fileName("")).toBeFalsy();
});

it("will access the directory name from a path", () => {
  expect(folderName("src/support/array/")).toBe(
    basePath(path.join("src", "support", "array")),
  );
  expect(folderName("src/support/array/index.ts")).toBe(
    basePath(path.join("src", "support", "array")),
  );

  const pathWithSep = path.join("src", "support", "array", "index.ts");
  expect(folderName(pathWithSep)).toBe(
    basePath(path.join("src", "support", "array")),
  );
});
