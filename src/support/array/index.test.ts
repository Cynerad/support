import { expect, it } from "vitest";

import { chunk, compact, difference, head, intersection, last, nth, range, remove, replace, sample, shuffle, sum, tail, take, union, unique } from ".";

it("will create an array range", () => {
  expect(range(5)).toStrictEqual([0, 1, 2, 3, 4, 5]);
  expect(range(5, 10)).toStrictEqual([5, 6, 7, 8, 9, 10]);
  expect(range(0, 12)).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  expect(range(5)).toStrictEqual([0, 1, 2, 3, 4, 5]);
  expect(range(0, 100, 10)).toStrictEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  expect(range(20, 11, -3)).toStrictEqual([20, 17, 14, 11]);
});

it("will unique array", () => {
  expect(unique([1, 2, 3, 4, 4])).toStrictEqual([1, 2, 3, 4]);
});

it("will replace the specified index form array", () => {
  expect(replace(["arthur", "dutch"], 1, "john")).toStrictEqual(["arthur", "john"]);
});

it("give random element from array", () => {
  const array = ["arthur", "dutch", "john"];
  expect(array.includes(sample(array)!)).toBe(true);
});

it("will return sum of the values ", () => {
  expect(sum([1, 2, 3, 4])).toBe(10);

  expect(sum([])).toBe(0);
});

it("will creates an array of elements split into groups the length of size", () => {
  expect(chunk(["a", "b", "c", "d"], 2)).toStrictEqual([["a", "b"], ["c", "d"]]);
  expect(chunk(["a", "b", "c", "d"], 3)).toStrictEqual([["a", "b", "c"], ["d"]]);
  expect(chunk([], 3)).toStrictEqual([]);
});

it("will create creates an array with all falsey values removed. The values false, null, 0, \"\", undefined, and NaN are falsey", () => {
  expect(compact([0, 1, false, 2, "", 3, Number.NaN, undefined, 0])).toStrictEqual([1, 2, 3]);
});

it("will creates an array of array values not included", () => {
  expect(difference([2, 1], [2, 3])).toStrictEqual([1]);
});

it("will remove an element form an array", () => {
  expect(remove(["john", "dutch", "arthur"], "john")).toStrictEqual(["dutch", "arthur"]);
});

it("will create a shuffle random ordered array", () => {
  const array = ["first", "second", "third", "forth"];
  expect(shuffle(array).length).toBe(4);
});

it("will give first element of array", () => {
  const array = ["first", "second", "third", "forth"];
  expect(head(array)).toBe("first");
  expect(head([])).toBe(undefined);
});

it("will give last element of array", () => {
  const array = ["first", "second", "third", "forth"];
  expect(last(array)).toBe("forth");
  expect(last([])).toBe(undefined);
});

it("will give n element of array", () => {
  const array = ["first", "second", "third", "forth"];
  expect(nth(array, 0)).toBe("first");
  expect(nth(array, 1)).toBe("second");
  expect(nth(array, 10)).toBe(undefined);
});

it("will creates an array of unique values that are included in all given arrays", () => {
  const firstArray = ["first", "second", "third", "forth"];
  const secondArray = ["second", "last", "john", "first"];
  expect(intersection(firstArray, secondArray)).toStrictEqual([
    "first",
    "second",
  ]);

  expect(intersection(["first"], [])).toStrictEqual([]);
});

it("will gets all but the first element of array", () => {
  const array = ["first", "second", "third"];
  expect(tail(array)).toStrictEqual(["second", "third"]);
  expect(tail([])).toStrictEqual([]);
});

it("will creates a slice of array with n elements taken from the beginning", () => {
  const array = ["first", "second", "third"];
  expect(take(array, 2)).toStrictEqual(["first", "second"]);
  expect(take(array, 0)).toStrictEqual([]);
  expect(take(array, 5)).toStrictEqual(array);
  expect(take(["john", "dutch", "arthur", "hosea", "mike"], 3)).toStrictEqual(["john", "dutch", "arthur"]);
});

it("will creates an array of unique values, in order", () => {
  expect(union([2], [1, 2])).toStrictEqual([2, 1]);
  expect(union(["john", "dutch"], ["dutch", "hosea"])).toStrictEqual(["john", "dutch", "hosea"]);
});
