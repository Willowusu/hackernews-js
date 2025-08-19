import { describe, it, expect } from "vitest";
import { htmlToText, toDate } from "../src/utils";

describe("utils", () => {
  it("converts HTML to text", () => {
    expect(htmlToText("<p>Hello <b>World</b></p>")).toBe("Hello World");
  });

  it("converts unix timestamp to Date", () => {
    const d = toDate(1609459200); // Jan 1, 2021
    expect(d?.getFullYear()).toBe(2021);
  });
});
