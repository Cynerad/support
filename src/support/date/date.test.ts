import dayjs from "dayjs";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import {
  dayOfMonth,
  dayOfWeak,
  diff,
  endOfMonth,
  endOfWeak,
  hour,
  isAfter,
  isBefore,
  isSame,
  minute,
  month,
  now,
  second,
  startOfMonth,
  startOfWeak,
  today,
  tomorrow,
  year,
  yesterday,
} from ".";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("now returns current dayjs instance", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);
  expect(now().toISOString()).toBe(dayjs(mockDate).toISOString());
});

it("today returns start of current day", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(today().toISOString()).toBe(dayjs(mockDate).startOf("day").toISOString());
});

it("tomorrow returns next day", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(tomorrow().toISOString()).toBe(dayjs(mockDate).add(1, "day").toISOString());
});

it("yesterday returns previous day", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(yesterday().toISOString()).toBe(dayjs(mockDate).subtract(1, "day").toISOString());
});

it("year returns current year", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(year()).toBe(2024);
});

it("month returns current month", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(month()).toBe(2); // March is month 2 (0-indexed)
});

it("dayOfMonth returns current day of month", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(dayOfMonth()).toBe(15);
});

it("dayOfWeak returns current day of week", () => {
  const mockDate = new Date("2024-03-15T10:30:45"); // Friday
  vi.setSystemTime(mockDate);

  expect(dayOfWeak()).toBe(5);
});

it("hour returns current hour", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(hour()).toBe(10);
});

it("second returns current second", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(second()).toBe(45);
});

it("minute returns current minute", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(minute()).toBe(30);
});

it("startOfWeak returns start of week", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(startOfWeak().toISOString()).toBe(dayjs(mockDate).startOf("week").toISOString());
});

it("endOfWeak returns end of week", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(endOfWeak().toISOString()).toBe(dayjs(mockDate).endOf("week").toISOString());
});

it("startOfMonth returns start of month", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(startOfMonth().toISOString()).toBe(dayjs(mockDate).startOf("month").toISOString());
});

it("endOfMonth returns end of month", () => {
  const mockDate = new Date("2024-03-15T10:30:45");
  vi.setSystemTime(mockDate);

  expect(endOfMonth().toISOString()).toBe(dayjs(mockDate).endOf("month").toISOString());
});

it("isBefore compares two dates", () => {
  const date1 = new Date("2024-03-10");
  const date2 = new Date("2024-03-15");

  expect(isBefore(date1, date2)).toBe(true);
  expect(isBefore(date2, date1)).toBe(false);
});

it("isAfter compares two dates", () => {
  const date1 = new Date("2024-03-15");
  const date2 = new Date("2024-03-10");

  expect(isAfter(date1, date2)).toBe(true);
  expect(isAfter(date2, date1)).toBe(false);
});

it("isSame compares two dates with default day unit", () => {
  const date1 = new Date("2024-03-15T10:00:00");
  const date2 = new Date("2024-03-15T15:00:00");

  expect(isSame(date1, date2)).toBe(true);
});

it("isSame compares two dates with custom unit", () => {
  const date1 = new Date("2024-03-15T10:30:00");
  const date2 = new Date("2024-03-15T10:45:00");

  expect(isSame(date1, date2, "hour")).toBe(true);
  expect(isSame(date1, date2, "minute")).toBe(false);
});

it("diff returns absolute difference with default day unit", () => {
  const date1 = new Date("2024-03-15");
  const date2 = new Date("2024-03-10");

  expect(diff(date1, date2)).toBe(5);
  expect(diff(date2, date1)).toBe(5);
});

it("diff returns absolute difference with custom unit", () => {
  const date1 = new Date("2024-03-15T10:00:00");
  const date2 = new Date("2024-03-15T15:00:00");

  expect(diff(date1, date2, "hour")).toBe(5);
});
