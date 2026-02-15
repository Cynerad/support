import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFetchClient, FetchError } from ".";

describe("createFetchClient", () => {
  const baseUrl = "https://api.example.com";
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn<typeof fetch>();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createMockResponse = (data: unknown, status = 200, statusText = "OK") => ({
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(JSON.stringify(data)),
    blob: vi.fn().mockResolvedValue(new Blob([JSON.stringify(data)])),
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
  });

  describe("url normalization", () => {
    it("should normalize URL with trailing slashes", async () => {
      const client = createFetchClient({ baseUrl: "https://api.example.com/" });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.get("/users/");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.any(Object),
      );
    });

    it("should handle URLs without slashes", async () => {
      const client = createFetchClient({ baseUrl: "https://api.example.com" });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.get("users");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.any(Object),
      );
    });

    it("should append query parameters from object", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.get("/users", { params: { page: 1, limit: 10 } });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users?page=1&limit=10",
        expect.any(Object),
      );
    });

    it("should append query parameters from URLSearchParams", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockResolvedValue(createMockResponse({}));

      const params = new URLSearchParams({ search: "test", filter: "active" });
      await client.get("/users", { params });

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users?search=test&filter=active",
        expect.any(Object),
      );
    });
  });

  describe("hTTP methods", () => {
    it("should make GET requests", async () => {
      const client = createFetchClient({ baseUrl });
      const mockData = { id: 1, name: "John" };
      fetchMock.mockResolvedValue(createMockResponse(mockData));

      const result = await client.get("/users/1");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({ method: "GET" }),
      );
      expect(result).toEqual(mockData);
    });

    it("should make POST requests with body", async () => {
      const client = createFetchClient({ baseUrl });
      const requestBody = { name: "Jane", email: "jane@example.com" };
      const mockResponse = { id: 2, ...requestBody };
      fetchMock.mockResolvedValue(createMockResponse(mockResponse));

      const result = await client.post("/users", requestBody);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should make PUT requests", async () => {
      const client = createFetchClient({ baseUrl });
      const requestBody = { name: "Updated Name" };
      fetchMock.mockResolvedValue(createMockResponse(requestBody));

      await client.put("/users/1", requestBody);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(requestBody),
        }),
      );
    });

    it("should make PATCH requests", async () => {
      const client = createFetchClient({ baseUrl });
      const requestBody = { email: "newemail@example.com" };
      fetchMock.mockResolvedValue(createMockResponse(requestBody));

      await client.patch("/users/1", requestBody);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(requestBody),
        }),
      );
    });

    it("should make DELETE requests", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.delete("/users/1");

      expect(fetchMock).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({ method: "DELETE" }),
      );
    });
  });

  describe("headers", () => {
    it("should apply default headers", async () => {
      const defaultHeaders = { Authorization: "Bearer token123" };
      const client = createFetchClient({ baseUrl, headers: defaultHeaders });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.get("/users");

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining(defaultHeaders),
        }),
      );
    });

    it("should merge custom headers with default headers", async () => {
      const defaultHeaders = { Authorization: "Bearer token123" };
      const client = createFetchClient({ baseUrl, headers: defaultHeaders });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.get("/users", {
        headers: { "X-Custom-Header": "value" },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": "Bearer token123",
            "X-Custom-Header": "value",
          }),
        }),
      );
    });

    it("should override default headers with custom headers", async () => {
      const client = createFetchClient({
        baseUrl,
        headers: { "Content-Type": "application/xml" },
      });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.post("/users", { name: "Test" }, {
        headers: { "Content-Type": "application/json" },
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should not set Content-Type for FormData", async () => {
      const client = createFetchClient({ baseUrl });
      const formData = new FormData();
      formData.append("file", new Blob(["test"]), "test.txt");
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.post("/upload", formData);

      const callHeaders = fetchMock.mock.calls[0]![1].headers as Record<string, string>;
      expect(callHeaders["Content-Type"]).toBeUndefined();
    });
  });

  describe("response types", () => {
    it("should parse JSON responses by default", async () => {
      const client = createFetchClient({ baseUrl });
      const mockData = { success: true };
      fetchMock.mockResolvedValue(createMockResponse(mockData));

      const result = await client.get("/data");

      expect(result).toEqual(mockData);
    });

    it("should return text when responseType is 'text'", async () => {
      const client = createFetchClient({ baseUrl });
      const mockText = "Plain text response";
      const mockResponse = createMockResponse({});
      mockResponse.text = vi.fn().mockResolvedValue(mockText);
      fetchMock.mockResolvedValue(mockResponse);

      const result = await client.get("/data", { responseType: "text" });

      expect(result).toBe(mockText);
    });

    it("should return blob when responseType is 'blob'", async () => {
      const client = createFetchClient({ baseUrl });
      const mockBlob = new Blob(["data"]);
      const mockResponse = createMockResponse({});
      mockResponse.blob = vi.fn().mockResolvedValue(mockBlob);
      fetchMock.mockResolvedValue(mockResponse);

      const result = await client.get("/file", { responseType: "blob" });

      expect(result).toBe(mockBlob);
    });

    it("should return arrayBuffer when responseType is 'arrayBuffer'", async () => {
      const client = createFetchClient({ baseUrl });
      const mockBuffer = new ArrayBuffer(16);
      const mockResponse = createMockResponse({});
      mockResponse.arrayBuffer = vi.fn().mockResolvedValue(mockBuffer);
      fetchMock.mockResolvedValue(mockResponse);

      const result = await client.get("/binary", { responseType: "arrayBuffer" });

      expect(result).toBe(mockBuffer);
    });

    it("should return raw response when responseType is 'response'", async () => {
      const client = createFetchClient({ baseUrl });
      const mockResponse = createMockResponse({});
      fetchMock.mockResolvedValue(mockResponse);

      const result = await client.get("/data", { responseType: "response" });

      expect(result).toBe(mockResponse);
    });
  });

  describe("error handling", () => {
    it("should throw FetchError on non-ok response", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockResolvedValue(createMockResponse({}, 404, "Not Found"));

      await expect(client.get("/users/999")).rejects.toThrow(FetchError);
      await expect(client.get("/users/999")).rejects.toThrow(
        "Request failed: 404 Not Found",
      );
    });

    it("should include status and statusText in FetchError", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockResolvedValue(createMockResponse({}, 500, "Internal Server Error"));

      try {
        await client.get("/error");
      }
      catch (error) {
        expect(error).toBeInstanceOf(FetchError);
        if (error instanceof FetchError) {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe("Internal Server Error");
        }
      }
    });

    it("should propagate network errors", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockRejectedValue(new Error("Network error"));

      await expect(client.get("/users")).rejects.toThrow("Network error");
    });
  });

  describe("edge cases", () => {
    it("should handle empty body in POST request", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.post("/users");

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: undefined,
        }),
      );
    });

    it("should handle null and undefined in query params", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.get("/users", {
        params: { active: true, deleted: null, archived: undefined },
      });

      const url = fetchMock.mock.calls[0]![0] as string;
      expect(url).toContain("active=true");
    });

    it("should pass additional fetch options", async () => {
      const client = createFetchClient({ baseUrl });
      fetchMock.mockResolvedValue(createMockResponse({}));

      await client.get("/users", {
        signal: new AbortController().signal,
        credentials: "include",
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          credentials: "include",
        }),
      );
    });
  });
});
