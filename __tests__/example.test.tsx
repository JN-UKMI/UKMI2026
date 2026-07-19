import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

/** Minimal smoke test to verify Vitest + RTL + jsdom setup */
describe("smoke", () => {
  it("runs a basic assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("renders into jsdom", () => {
    render(<div data-testid="hello">Hello Vitest</div>);
    expect(screen.getByTestId("hello")).toHaveTextContent("Hello Vitest");
  });
});
