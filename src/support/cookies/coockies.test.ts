// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { cookies } from ".";

describe("cookies", () => {
  beforeEach(() => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")?.[0]?.trim();
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  });

  afterEach(() => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")?.[0]?.trim();
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  });

  describe("set", () => {
    it("should set a string cookie", () => {
      cookies.set("name", "john");

      expect(cookies.get("name")).toBe("john");
    });

    it("should set a number cookie", () => {
      cookies.set("age", 25);

      expect(cookies.get("age")).toBe("25");
    });

    it("should set an object cookie as JSON", () => {
      const data = { key: "value", nested: { prop: "test" } };
      cookies.set("data", data);

      const retrieved = cookies.get("data");
      expect(JSON.parse(retrieved!)).toEqual(data);
    });

    it("should set an array cookie as JSON", () => {
      const items = ["item1", "item2", "item3"];
      cookies.set("items", items);

      const retrieved = cookies.get("items");
      expect(JSON.parse(retrieved!)).toEqual(items);
    });

    it("should overwrite existing cookie", () => {
      cookies.set("name", "john");
      cookies.set("name", "jane");

      expect(cookies.get("name")).toBe("jane");
    });

    it("should set cookie with options", () => {
      cookies.set("secure", "value", {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      expect(cookies.get("secure")).toBe("value");
    });
  });

  describe("get", () => {
    it("should retrieve an existing cookie", () => {
      cookies.set("username", "testUser");

      expect(cookies.get("username")).toBe("testUser");
    });

    it("should return null for non-existent cookie", () => {
      expect(cookies.get("nonexistent")).toBeNull();
    });

    it("should handle cookies with special characters", () => {
      const value = "value with spaces & special=chars";
      cookies.set("special", value);

      expect(cookies.get("special")).toBe(value);
    });
  });

  describe("has", () => {
    it("should return true for existing cookie", () => {
      cookies.set("token", "abc123");

      expect(cookies.has("token")).toBe(true);
    });

    it("should return false for non-existent cookie", () => {
      expect(cookies.has("missing")).toBe(false);
    });
  });

  describe("remove", () => {
    it("should remove an existing cookie", () => {
      cookies.set("temporary", "value");
      expect(cookies.has("temporary")).toBe(true);

      cookies.remove("temporary");

      expect(cookies.has("temporary")).toBe(false);
      expect(cookies.get("temporary")).toBeNull();
    });

    it("should handle removing non-existent cookie gracefully", () => {
      expect(() => cookies.remove("nonexistent")).not.toThrow();
    });
  });

  describe("clear", () => {
    it("should remove all cookies", () => {
      cookies.set("cookie1", "value1");
      cookies.set("cookie2", "value2");
      cookies.set("cookie3", "value3");

      expect(cookies.has("cookie1")).toBe(true);
      expect(cookies.has("cookie2")).toBe(true);

      cookies.clear();

      expect(cookies.has("cookie1")).toBe(false);
      expect(cookies.has("cookie2")).toBe(false);
      expect(cookies.has("cookie3")).toBe(false);
    });

    it("should work when no cookies exist", () => {
      expect(() => cookies.clear()).not.toThrow();
    });
  });

  describe("mapped", () => {
    it("should return a Map instance", () => {
      expect(cookies.mapped()).toBeInstanceOf(Map);
    });

    it("should return empty Map when no cookies exist", () => {
      const map = cookies.mapped();

      expect(map.size).toBe(0);
    });

    it("should return Map with all cookies", () => {
      cookies.set("name", "john");
      cookies.set("age", 30);
      cookies.set("active", true);

      const map = cookies.mapped();

      expect(map.size).toBe(3);
      expect(map.get("name")).toBe("john");
      expect(map.get("age")).toBe("30");
      expect(map.get("active")).toBe("true");
    });

    it("should handle object cookies in Map", () => {
      const userData = { id: 1, name: "Alice" };
      cookies.set("user", userData);
      cookies.set("session", "xyz789");

      const map = cookies.mapped();

      expect(map.size).toBe(2);
      expect(JSON.parse(map.get("user")!)).toEqual(userData);
      expect(map.get("session")).toBe("xyz789");
    });

    it("should reflect current state of cookies", () => {
      cookies.set("initial", "value");
      let map = cookies.mapped();
      expect(map.size).toBe(1);

      cookies.set("added", "new");
      map = cookies.mapped();
      expect(map.size).toBe(2);

      cookies.remove("initial");
      map = cookies.mapped();
      expect(map.size).toBe(1);
      expect(map.has("initial")).toBe(false);
      expect(map.has("added")).toBe(true);
    });
  });

  describe("all", () => {
    it("should return all cookies as object", () => {
      cookies.set("firstName", "John");
      cookies.set("lastName", "Doe");

      const all = cookies.all();

      expect(all).toEqual({
        firstName: "John",
        lastName: "Doe",
      });
    });

    it("should return empty object when no cookies exist", () => {
      expect(cookies.all()).toEqual({});
    });
  });

  describe("edge cases", () => {
    it("should handle empty string values", () => {
      cookies.set("empty", "");

      expect(cookies.get("empty")).toBe("");
      expect(cookies.has("empty")).toBe(true);
    });

    it("should handle boolean values", () => {
      cookies.set("isActive", true);
      cookies.set("isDeleted", false);

      expect(cookies.get("isActive")).toBe("true");
      expect(cookies.get("isDeleted")).toBe("false");
    });

    it("should handle null values", () => {
      cookies.set("nullable", null);

      expect(cookies.get("nullable")).toBe("null");
    });

    it("should handle undefined values", () => {
      cookies.set("undef", undefined);

      expect(cookies.get("undef")).toBe("undefined");
    });

    it("should handle cookie names with numbers", () => {
      cookies.set("cookie123", "value");
      cookies.set("123cookie", "value");

      expect(cookies.get("cookie123")).toBe("value");
      expect(cookies.get("123cookie")).toBe("value");
    });

    it("should handle complex nested objects", () => {
      const complex = {
        user: {
          profile: {
            name: "John",
            settings: {
              theme: "dark",
              notifications: true,
            },
          },
        },
        timestamps: [1234567890, 9876543210],
      };

      cookies.set("complex", complex);

      const retrieved = JSON.parse(cookies.get("complex")!);
      expect(retrieved).toEqual(complex);
    });
  });

  describe("multiple operations", () => {
    it("should handle multiple set and get operations", () => {
      cookies.set("a", "1");
      cookies.set("b", "2");
      expect(cookies.get("a")).toBe("1");

      cookies.set("c", "3");
      expect(cookies.get("b")).toBe("2");
      expect(cookies.get("c")).toBe("3");
    });

    it("should maintain data integrity across operations", () => {
      const original = { key: "original" };
      cookies.set("data", original);

      cookies.set("other", "value");

      const retrieved = JSON.parse(cookies.get("data")!);
      expect(retrieved).toEqual(original);
    });
  });
});
