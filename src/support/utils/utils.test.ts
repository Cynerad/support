// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

import { after, before, copyToClipboard, debounce, isEmpty, once, promise, sleep, throttle, throwError } from ".";

describe("isEmpty", () => {
  it("returns true for null/undefined", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it("handles strings and arrays", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty("hi")).toBe(false);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1])).toBe(false);
  });

  it("handles objects", () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});

describe("promise", () => {
  it("returns result on success", async () => {
    const result = await promise(() => 5);
    expect(result).toBe(5);
  });

  it("uses errorCallback on error", async () => {
    const result = await promise(
      () => { throw new Error("fail"); },
      () => "handled",
    );
    expect(result).toBe("handled");
  });
});

it("throws Error instance", () => {
  expect(() => throwError("boom")).toThrow("boom");
});

describe("sleep", () => {
  it("should resolve after specified time", async () => {
    vi.useFakeTimers();

    const sleepPromise = sleep(1000);

    await vi.advanceTimersByTimeAsync(1000);

    await expect(sleepPromise).resolves.toBeUndefined();

    vi.useRealTimers();
  });
});

describe("after", () => {
  it("calls only after n calls", () => {
    const fn = vi.fn(() => "done");
    const wrapped = after(3, fn);

    wrapped();
    wrapped();
    expect(fn).not.toHaveBeenCalled();

    expect(wrapped()).toBe("done");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("before", () => {
  it("calls only before n calls", () => {
    const fn = vi.fn(() => "run");
    const wrapped = before(2, fn);

    wrapped();
    wrapped();
    wrapped();

    expect(fn).toHaveBeenCalledTimes(2);
  });
});

it("should return once per call ", () => {
  let sum = 0;
  const increment = once(() => {
    sum += 1;
  });

  increment();

  expect(sum).toBe(1);

  increment();

  expect(sum).toBe(1);
});

describe("copyToClipboard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uses Clipboard API when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.assign(navigator, {
      clipboard: { writeText },
    });

    const result = await copyToClipboard("hello");
    expect(writeText).toHaveBeenCalledWith("hello");
    expect(result).toBe(true);
  });

  it("returns false for invalid input", async () => {
    const result = await copyToClipboard("" as any);
    expect(result).toBe(false);
  });
});

describe("debounce", () => {
  it("delays execution", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 200);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

describe("throttle", () => {
  it("limits execution frequency", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const throttled = throttle(fn, 200);

    throttled(); // should call
    throttled(); // should not
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(200);
    throttled(); // should call again
    expect(fn).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
