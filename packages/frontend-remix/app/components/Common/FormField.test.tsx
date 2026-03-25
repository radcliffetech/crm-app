import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("renders label and children", () => {
    const { unmount } = render(
      <FormField label="Email">
        <input data-testid="input" />
      </FormField>,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
    unmount();
  });

  it("shows required indicator when required", () => {
    const { unmount } = render(
      <FormField label="Name" required>
        <input />
      </FormField>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
    unmount();
  });

  it("does not show required indicator when not required", () => {
    const { container, unmount } = render(
      <FormField label="Phone">
        <input />
      </FormField>,
    );
    expect(container.querySelector(".text-red-500")).toBeNull();
    unmount();
  });
});
