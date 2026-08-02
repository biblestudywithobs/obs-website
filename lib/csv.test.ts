import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("toCsv", () => {
  it("joins headers and rows with commas", () => {
    expect(toCsv(["Name", "Email"], [["Ada", "ada@example.com"]])).toBe(
      "Name,Email\r\nAda,ada@example.com",
    );
  });

  it("quotes fields containing a comma", () => {
    expect(toCsv(["Location"], [["Lagos, Nigeria"]])).toBe('Location\r\n"Lagos, Nigeria"');
  });

  it("doubles internal quotes and wraps in quotes", () => {
    expect(toCsv(["Note"], [['Say "hi"']])).toBe('Note\r\n"Say ""hi"""');
  });

  it("quotes fields containing a newline", () => {
    expect(toCsv(["Message"], [["Line one\nLine two"]])).toBe('Message\r\n"Line one\nLine two"');
  });

  it("renders null/undefined as an empty field", () => {
    expect(toCsv(["A", "B"], [[null, undefined]])).toBe("A,B\r\n,");
  });
});
