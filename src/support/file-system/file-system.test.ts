import { expect, it } from "vitest";

import { fileSystem } from ".";
import { trim } from "../string";

function playground(path: string = "/") {
  return `playground/test/${trim(path, "/")}`;
}

async function cleanUp() {
  await fileSystem.remove(playground(), { recursive: true });
}

it("make sure file or folder exists", async () => {
  await fileSystem.createDirectory(playground("foldername"));

  const fileExists = await fileSystem.pathExists(playground("foldername"));
  expect(fileExists).toBe(true);
});

it("will create new folder", async () => {
  await fileSystem.createDirectory(playground("foldername"));

  expect(await fileSystem.pathExists(playground("foldername"))).toBe(true);

  cleanUp();
});

it("will create file for specified path", async () => {
  await fileSystem.createFile(playground("string.json"));

  expect(await fileSystem.fileExists(playground("string.json"))).toBe(true);

  await cleanUp();
});

it("will remove folder for specified path", async () => {
  await fileSystem.createDirectory(playground("foldername/tests"));

  await fileSystem.remove(playground("foldername/tests"), { recursive: true });

  expect(await fileSystem.pathExists(playground("foldername/tests"))).toBe(false);

  await cleanUp();
});

it("will remove file for specified path", async () => {
  await fileSystem.createFile(playground("foldername/tests/string.ts"));

  await fileSystem.remove(playground("foldername/tests/string.ts"), { recursive: true });

  expect(await fileSystem.pathExists(playground("foldername/tests/string.ts"))).toBe(false);

  await cleanUp();
});

it("will read content and return string ", async () => {
  const data = await fileSystem.get("src/support/string/index.ts");
  expect(data).toBeTypeOf("string");
});

it("will return true if path exists", async () => {
  expect(await fileSystem.pathExists("src/support")).toBe(true);
  expect(await fileSystem.pathExists("src/notExists")).toBe(false);
  expect(await fileSystem.pathExists("src/dutch/index.ts")).toBe(false);
});

it("will create new empty file", async () => {
  await fileSystem.createFile(playground("file.yaml"));

  expect(await fileSystem.pathExists(playground("file.yaml"))).toBe(true);

  await cleanUp();
});

it("will create new empty folder", async () => {
  await fileSystem.createDirectory(playground("foldername"));

  expect(await fileSystem.pathExists(playground("foldername"))).toBe(true);

  await cleanUp();
});

it("will remove file from specified path", async () => {
  await fileSystem.createFile(playground("/foldername/string.json"));

  await fileSystem.remove(playground("/foldername/string.json"));

  expect(await fileSystem.pathExists("/foldername/string.json")).toBe(false);

  await cleanUp();
});

it("will remove folder form specified path", async () => {
  await fileSystem.createDirectory(playground("foldername/test/file"));
  await fileSystem.createFile(playground("foldername/test/file/string.json"));

  await fileSystem.remove(playground("foldername/test/file"), { recursive: true });

  expect(await fileSystem.pathExists("foldername/test/file")).toBe(false);

  await cleanUp();
});

it("will write to the file", async () => {
  await fileSystem.write(playground("foldername/test/string.json"), `{
     "name" : "hello world"
 }`);

  const data = (await fileSystem.get(playground("foldername/test/string.json"))).toString();

  expect(data.includes(`"name" : "hello world"`)).toBe(true);

  await cleanUp();
});

it("will append to the file test 2", async () => {
  await fileSystem.write(playground("foldername/test/readme.md"), "hello world");

  await fileSystem.append(playground("foldername/test/readme.md"), "\nhello john");

  const data = (await fileSystem.get(playground("foldername/test/readme.md"))).toString();

  expect(data.includes(`hello world
hello john`)).toBe(true);

  await cleanUp();
});

it("will append to the file", async () => {
  await fileSystem.write(playground("foldername/test/readme.md"), "hello world");

  await fileSystem.replaceContent(playground("foldername/test/readme.md"), "hello world", "hello john");

  const data = (await fileSystem.get(playground("foldername/test/readme.md"))).toString();

  expect(data.includes("hello john")).toBe(true);

  await cleanUp();
});

it("will rename a file", async () => {
  await fileSystem.write(playground("foldername/string.md"), "hello world");

  await fileSystem.rename(playground("foldername/string.md"), playground("foldername/text.md"));

  expect((await fileSystem.get(playground("foldername/text.md"))).toString().includes("hello world")).toBe(true);

  await cleanUp();
});

it("will copy folder to specified path", async () => {
  await fileSystem.write(playground("foldername/rose/index.md"), "hello world");

  await fileSystem.copy(playground("foldername/rose"), playground("foldername/bose"));

  expect(await fileSystem.pathExists(playground("foldername/bose"))).toBe(true);

  await cleanUp();
});

it("will copy file to specified path", async () => {
  await fileSystem.write(playground("foldername/rose/index.md"), "hello world");

  await fileSystem.copy(playground("foldername/rose/index.md"), playground("foldername/bose/text.md"));

  expect(await fileSystem.pathExists(playground("foldername/bose/text.md"))).toBe(true);

  await cleanUp();
});

it("will cut folder , file to specified path", async () => {
  await fileSystem.write(playground("foldername/rose/index.md"), "hello world");

  await fileSystem.cut(playground("foldername/rose"), playground("foldername/bose"));

  expect(await fileSystem.pathExists(playground("foldername/bose/index.md"))).toBe(true);

  await cleanUp();
});

// TODO;
// it("will create temporary file to specified path", async () => {
//   await fileSystem.temporary(playground("randomstring"));

//   expect(await fileSystem.pathExists(playground("randomstring"))).toBe(true);

//   await cleanUp();
// });

// create symlink TODO
// it("will create symbolic link for a folder", async () => {
//   await fileSystem.createFile(playground("foldername/john/index.ts"));

//   await fileSystem.symbolicLink(playground("foldername/john/index.ts"), playground("linked/user"));

//   await cleanUp();
// });
