import { expect, it } from "vitest";

import { after, append, before, between, camel, headline, kebab, limit, lowerCaseFirst, mask, pad, slug, snake, squish, studly, swap, title, trim, truncate, upperCaseFirst, uuid, wordCount } from ".";

it("return after that string", () => {
  expect(after("This is my name", "This is")).toBe(" my name");
});

it("will append an string to string if its exsits", () => {
  expect(append("www.example.com", "")).toBe("www.example.com");
  expect(append("www.example.com", "?q=arthur")).toBe("www.example.com?q=arthur");
});

it("is returning empty string if cant find the word for after method", () => {
  expect(after("This is my name", "arthur")).toBe("");
});

it("return before that string", () => {
  expect(before("This is my name", "my name")).toBe("This is ");
});

it("is returning empty string if cant find the word for before method", () => {
  expect(before("This is my name", "arthur")).toBe("");
});

it("return string between first value and second value", () => {
  expect(between("This is my name", "This", "name")).toBe(" is my ");
});

it("removes selected chars to trim form left and right", () => {
  expect(trim("/arthur morgan///", "/")).toBe("arthur morgan");
});

it("turn string to camel case", () => {
  expect(camel("foo_bar")).toBe("fooBar");
  expect(camel("foo-bar")).toBe("fooBar");
  expect(camel("fooBar")).toBe("fooBar");
});

it("will convert strings delimited by casing, hyphens, or underscores into a space delimited string with each word's first letter capitalized", () => {
  expect(headline("steve_jobs")).toBe("Steve Jobs");
  expect(headline("EmailNotificationSent")).toBe("Email Notification Sent");
});

it("will converts the given string to kebab-case", () => {
  expect(kebab("fooBar")).toBe("foo-bar");
  expect(kebab("FooBarBaz")).toBe("foo-bar-baz");
  expect(kebab("foo_bar")).toBe("foo-bar");
  expect(kebab("fooBar_baz")).toBe("foo-bar-baz");
  expect(kebab("helloWorld Test")).toBe("hello-world-test");
});

it("returns the given string with the first character lowercased", () => {
  expect(lowerCaseFirst("Foo Bar")).toBe("foo Bar");
});

it("truncates the given string to the specified length", () => {
  expect(limit("The quick brown fox jumps over the lazy dog", 20)).toBe("The quick brown fox ...");
});

it("will padding sides of a string with another string ", () => {
  expect(pad("James", 10, "_", "pad-center")).toBe("__James___");
  expect(pad("James", 10, "_", "pad-left")).toBe("_____James");
  expect(pad("James", 10, "_", "pad-right")).toBe("James_____");
  expect(pad("James", 10)).toBe("  James   ");
});

it("will masks a portion of a string with a repeated character", () => {
  expect(mask("taylor@example.com", "*", 3)).toBe("tay***************");
});

it("will generates a URL friendly slug from the given string", () => {
  expect(slug("read dead redemption 2")).toBe("read-dead-redemption-2");
});

it("will converts the given string to ", () => {
  expect(snake("fooBar")).toBe("foo_bar");
});

it("removes all extraneous white space from a string", () => {
  expect(squish("      dutch van der     linde       ")).toBe("dutch van der linde");
});

it("method converts the given string to StudlyCase", () => {
  expect(studly("foo_bar")).toBe("FooBar");
});

it("replaces multiple values in the given", () => {
  expect(swap({
    Tacos: "Burritos",
    great: "fantastic",
  }, "Tacos are great!")).toBe("Burritos are fantastic!");
});

it("will converts the given string to Title Case", () => {
  expect(title("a nice title uses the correct case")).toBe("A Nice Title Uses The Correct Case");
});

it("returns the given string with the first character capitalized", () => {
  expect(upperCaseFirst("foo bar")).toBe("Foo bar");
});

it("creates random uuid", () => {
  expect(uuid()).toBeTypeOf("string");
});

it("method returns the number of words that a string contains", () => {
  expect(wordCount("Hello, world!")).toBe(2);
});

it("will Truncates string if it's longer than the given maximum string length. The last characters of the truncated string are replaced with the omission string which defaults to", () => {
  expect(truncate("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia modi blanditiis odio eius! Dolor, iusto quod atque quibusdam sequi fugit excepturi debitis quidem ut adipisci doloremque! In, perferendis facere porro.", 10)).toBe("Lorem ipsu...");
});
