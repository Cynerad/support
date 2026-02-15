import { expect, it } from "vitest";

import { abbreviate, between, clamp, currency, fileSize, forHumans, ordinal, percentage, random } from ".";

it("checks is number is between a range", () => {
  expect(between(5, 1, 10)).toBe(true);
  expect(between(10, 1, 10)).toBe(true);
  expect(between(25, 30, 100)).toBe(false);
});

it("give random number", () => {
  expect(random(200)).toBeTypeOf("number");

  const start = 1;
  const end = 200;
  expect(between(random(start, end), start, end)).toBe(true);

  expect(between(random(5), 0, 5)).toBe(true);
});

it("will provide human-readable format of the provided numerical value", () => {
  expect(abbreviate(12000)).toBe("12K");
});

it("ensures a given number stays within a specified range", () => {
  expect(clamp(105, 10, 100)).toBe(100);
  expect(clamp(5, 10, 100)).toBe(10);
  expect(clamp(10, 10, 100)).toBe(10);
  expect(clamp(20, 10, 100)).toBe(20);
});

it("returns the currency representation of the given value as a string", () => {
  expect(currency(1000)).toBe("$1,000.00");
});

it("returns the human-readable format of the provided numerical value", () => {
  expect(forHumans(1000)).toBe("1 thousand");
  expect(forHumans(489939)).toBe("490 thousand");
  expect(forHumans(1230000, { minimumFractionDigits: 2 })).toBe("1.23 million");
});

it("will returns the file size representation of the given byte value as a string", () => {
  expect(fileSize(1024)).toBe("1KB");
  expect(fileSize(1024 * 1024)).toBe("1MB");
  expect(fileSize(1024, { minimumFractionDigits: 2 })).toBe("1.024KB");
});

it("will returns a number's ordinal representation", () => {
  expect(ordinal(1)).toBe("1st");
  expect(ordinal(2)).toBe("2nd");
  expect(ordinal(3)).toBe("3rd");
  expect(ordinal(122)).toBe("122nd");
});

it("will returns the percentage representation of the given value as a string", () => {
  expect(percentage(10)).toBe("10%");
  expect(percentage(10, { minimumFractionDigits: 2 })).toBe("10.00%");
  expect(percentage(10.123, { maximumFractionDigits: 2 })).toBe("10.12%");
  expect(percentage(10, { minimumFractionDigits: 2 }, "de")).toBe("10,00\u00A0%");
  expect(percentage(10, {}, "fa")).toBe("۱۰٪");
});
