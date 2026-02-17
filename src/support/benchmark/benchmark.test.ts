import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { benchmark } from ".";

describe("benchmark", () => {
  beforeEach(() => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    vi.spyOn(performance, "now");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call the provided callback function", () => {
    const mockCallback = vi.fn();

    benchmark(mockCallback);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should measure execution time using performance.now", () => {
    const mockCallback = vi.fn();

    benchmark(mockCallback);

    expect(performance.now).toHaveBeenCalledTimes(2);
  });

  it("should log execution time to console", () => {
    const mockCallback = vi.fn();

    benchmark(mockCallback);

    expect(console.info).toHaveBeenCalledWith(
      expect.stringMatching(/^Execution time: \d+\.\d{2} ms$/),
    );
  });

  it("should calculate elapsed time correctly", () => {
    vi.mocked(performance.now)
      .mockReturnValueOnce(1000) // start time
      .mockReturnValueOnce(1250); // end time

    const mockCallback = vi.fn();

    benchmark(mockCallback);

    expect(console.info).toHaveBeenCalledWith("Execution time: 250.00 ms");
  });

  it("should handle callbacks that throw errors", () => {
    const errorCallback = vi.fn(() => {
      throw new Error("Test error");
    });

    expect(() => benchmark(errorCallback)).toThrow("Test error");
  });

  it("should format time with 2 decimal places", () => {
    vi.mocked(performance.now)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(123.456789);

    const mockCallback = vi.fn();

    benchmark(mockCallback);

    expect(console.info).toHaveBeenCalledWith("Execution time: 123.46 ms");
  });
});
