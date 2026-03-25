import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentForm } from "./StudentForm";

const defaultFormData = {
  name_first: "",
  name_last: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

function renderForm(overrides: Partial<Parameters<typeof StudentForm>[0]> = {}) {
  const props = {
    formData: defaultFormData,
    setFormData: vi.fn(),
    onSubmit: vi.fn(),
    editingstudent_id: null,
    onCancel: vi.fn(),
    ...overrides,
  };
  return { ...render(<StudentForm {...props} />), props };
}

describe("StudentForm", () => {
  it("renders all form fields", () => {
    const { unmount } = renderForm();
    expect(screen.getByText("First Name")).toBeInTheDocument();
    expect(screen.getByText("Last Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    unmount();
  });

  it("calls setFormData when typing in first name", async () => {
    const setFormData = vi.fn();
    const { unmount } = renderForm({
      formData: { ...defaultFormData, name_first: "" },
      setFormData,
    });
    // Get the first text input (First Name)
    const inputs = screen.getAllByRole("textbox");
    await userEvent.type(inputs[0], "J");
    expect(setFormData).toHaveBeenCalled();
    unmount();
  });

  it("shows Save button when creating", () => {
    const { unmount } = renderForm({ editingstudent_id: null });
    expect(screen.getByText("Save")).toBeInTheDocument();
    unmount();
  });

  it("shows Update button when editing", () => {
    const { unmount } = renderForm({ editingstudent_id: "123" });
    expect(screen.getByText("Update")).toBeInTheDocument();
    unmount();
  });
});
