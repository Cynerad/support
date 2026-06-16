import { afterEach, expect, it } from "vitest";

import { fileSystem } from "@/lib/support/file-system";
import { generate, generateWithStub } from "@/lib/support/generator";
import { trim } from "@/lib/support/string";

function playground(path: string = "/") {
  return `playground/test/${trim(path, "/")}`;
}

afterEach(async () => {
  await fileSystem.remove(playground(), { recursive: true, force: true });
});

it("will create new file with extension tsx", async () => {
  await generate({
    filePath: playground("testComponent"),
  });

  expect(await fileSystem.fileExists(playground("testComponent.tsx"))).toBe(
    true,
  );
});

it("will create new file with specific extension", async () => {
  await generate({
    filePath: playground("testComponent"),
    mime: "mdx",
  });

  expect(await fileSystem.fileExists(playground("testComponent.mdx"))).toBe(
    true,
  );
});

it("will generate a file with specific stub path", async () => {
  const destinationPath = playground("component/ui/button");

  const stubPath = playground("stubPath.stub");
  await fileSystem.write(stubPath, "this is default stub for it");

  expect(await fileSystem.fileExists(stubPath)).toBe(true);

  await generateWithStub({
    filePath: destinationPath,
    stubPath,
    mime: "tsx",
    replaceParameters: {
      stub: "jhon",
    },
  });

  const generatedFileData = (
    await fileSystem.get(`${destinationPath}.tsx`)
  ).toString();

  console.log(generatedFileData);

  expect(generatedFileData.includes("jhon")).toBe(true);
  expect(generatedFileData.toString().includes("stub")).toBe(false);

  expect(await fileSystem.fileExists(`${destinationPath}.tsx`)).toBe(true);
});
