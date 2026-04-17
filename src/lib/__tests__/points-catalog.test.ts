import { describe, it, expect } from "vitest";
import { calcTier, TIERS } from "../points-catalog";

describe("calcTier", () => {
  it("returns Advocate for 0 points", () => {
    expect(calcTier(0)).toBe("Advocate");
  });
  it("returns Advocate for 1 point", () => {
    expect(calcTier(1)).toBe("Advocate");
  });
  it("returns Advocate for 1499 points", () => {
    expect(calcTier(1499)).toBe("Advocate");
  });
  it("returns Advisor for exactly 1500 points", () => {
    expect(calcTier(1500)).toBe("Advisor");
  });
  it("returns Advisor for 4999 points", () => {
    expect(calcTier(4999)).toBe("Advisor");
  });
  it("returns Architect for exactly 5000 points", () => {
    expect(calcTier(5000)).toBe("Architect");
  });
  it("returns Architect for very large numbers", () => {
    expect(calcTier(999999)).toBe("Architect");
  });
});

describe("calcTier aligns with TIERS constants", () => {
  it("returns Advisor at TIERS.Advisor.min", () => {
    expect(calcTier(TIERS.Advisor.min)).toBe("Advisor");
  });
  it("returns Architect at TIERS.Architect.min", () => {
    expect(calcTier(TIERS.Architect.min)).toBe("Architect");
  });
});
