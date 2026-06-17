// fetch.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateFetchClient } from "@/lib/support/fetch";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function makeApi(overrides = {}) {
  return new CreateFetchClient({
    baseUrl: "https://api.example.com",
    ...overrides,
  }).create();
}

describe("create Fetch Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("get returns typed json response", async () => {
    mockFetch.mockResolvedValue(makeResponse({ name: "John" }));

    const api = makeApi();
    const res = await api.get({ endpoint: "users/1" });
    const json = await res.json();

    expect(json).toEqual({ name: "John" });
  });

  it("throws ApiError on non-ok response", async () => {
    mockFetch.mockResolvedValue(makeResponse({ message: "not found" }, 404));

    const api = makeApi();

    await expect(api.get({ endpoint: "users/999" })).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      data: { message: "not found" },
    });
  });

  it("calls onError with response before throwing", async () => {
    mockFetch.mockResolvedValue(makeResponse({ message: "unauthorized" }, 401));

    const onError = vi.fn();
    const api = makeApi();

    await expect(
      api.get({ endpoint: "users/1", onError }),
    ).rejects.toMatchObject({ status: 401 });

    expect(onError).toHaveBeenCalledOnce();
  });

  it("runs request middlewares and merges headers", async () => {
    mockFetch.mockResolvedValue(makeResponse({ name: "John" }));

    const api = new CreateFetchClient({
      baseUrl: "https://api.example.com",
      options: { headers: { accept: "application/json" } },
      middleware: [
        config => ({
          ...config,
          headers: {
            ...(config.headers as Record<string, string>),
            "x-custom": "test",
          },
        }),
      ],
    }).create();

    await api.get({ endpoint: "users/1" });

    const calledHeaders = mockFetch.mock.calls[0][1].headers;
    expect(calledHeaders).toMatchObject({
      "accept": "application/json",
      "x-custom": "test",
    });
  });

  it("runs beforeResponse hooks", async () => {
    mockFetch.mockResolvedValue(makeResponse({ name: "John" }));

    const hook = vi.fn(r => r);
    const api = new CreateFetchClient({
      baseUrl: "https://api.example.com",
      beforeResponse: [hook],
    }).create();

    await api.get({ endpoint: "users/1" });

    expect(hook).toHaveBeenCalledOnce();
  });

  it("throws ApiError on timeout", async () => {
    mockFetch.mockImplementation(
      (_, { signal }: RequestInit) =>
        new Promise((_, reject) => {
          signal?.addEventListener("abort", () => {
            const err = new DOMException("Aborted", "AbortError");
            reject(err);
          });
        }),
    );

    const api = new CreateFetchClient({
      baseUrl: "https://api.example.com",
      timeout: 1,
    }).create();

    await expect(api.get({ endpoint: "users/1" })).rejects.toMatchObject({
      name: "ApiError",
      status: 408,
    });
  });

  it("resolves absolute endpoint urls ignoring baseUrl", async () => {
    mockFetch.mockResolvedValue(makeResponse({ name: "John" }));

    const api = makeApi();
    await api.get({ endpoint: "https://other.api.com/users/1" });

    expect(mockFetch.mock.calls[0][0].toString()).toBe(
      "https://other.api.com/users/1",
    );
  });
});
