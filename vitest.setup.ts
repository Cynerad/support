import { vi } from "vitest";

// Mock DOM APIs
globalThis.document = {
  createElement: vi.fn(() => ({
    value: "",
    style: {},
    setAttribute: vi.fn(),
    select: vi.fn(),
    focus: vi.fn(),
  })),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
  execCommand: vi.fn(),
} as any;

globalThis.navigator = {
  clipboard: {
    writeText: vi.fn(),
  },
} as any;
