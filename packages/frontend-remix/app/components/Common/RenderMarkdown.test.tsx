import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import RenderMarkdown from "./RenderMarkdown";

describe("RenderMarkdown", () => {
  it("renders plain text", () => {
    const { container } = render(<RenderMarkdown>Hello world</RenderMarkdown>);
    expect(container.textContent).toBe("Hello world");
  });

  it("converts newlines to br tags", () => {
    const { container } = render(<RenderMarkdown>{"Line 1\nLine 2"}</RenderMarkdown>);
    expect(container.querySelector("br")).toBeInTheDocument();
  });

  it("renders bold text", () => {
    const { container } = render(<RenderMarkdown>{"**bold**"}</RenderMarkdown>);
    expect(container.querySelector("strong")?.textContent).toBe("bold");
  });

  it("renders italic text", () => {
    const { container } = render(<RenderMarkdown>{"*italic*"}</RenderMarkdown>);
    expect(container.querySelector("em")?.textContent).toBe("italic");
  });
});
