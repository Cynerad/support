import { expect, it } from "vitest";

import { add, isEqual, remove } from ".";

it("will compare 2 objects and return boolean", () => {
  expect(isEqual({ name: "arthur", price: 5000 }, { price: 5000, name: "arthur" })).toBe(true);
  expect(isEqual({ x: 10, y: { z: 40 } }, { x: 10, y: { z: 40 } })).toBe(true);
  expect(isEqual({ x: 10, y: { z: 40 } }, { x: 12, y: { z: 40 } })).toBe(false);
});

it("adds a given key / value pair to an object", () => {
  const object = add({ name: "desk", price: null }, "price", 300);
  expect(isEqual(object, { name: "desk", price: 300 })).toBe(true);
});

it("removes a given keys to an object", () => {
  const object = remove({ name: "desk", price: null }, "price");
  expect(isEqual(object, { name: "desk" })).toBe(true);
});
