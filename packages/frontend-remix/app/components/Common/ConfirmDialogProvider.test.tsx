import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialogProvider, useConfirmDialog } from "./ConfirmDialogProvider";

function TestComponent({ onResult }: { onResult: (result: boolean) => void }) {
  const confirm = useConfirmDialog();
  return (
    <button
      onClick={async () => {
        const result = await confirm({
          title: "Delete Item",
          description: "Are you sure?",
          confirmText: "Yes",
          cancelText: "No",
        });
        onResult(result);
      }}
    >
      Trigger
    </button>
  );
}

function renderWithProvider(onResult: (r: boolean) => void = () => {}) {
  return render(
    <ConfirmDialogProvider>
      <TestComponent onResult={onResult} />
    </ConfirmDialogProvider>,
  );
}

describe("ConfirmDialogProvider", () => {
  it("does not show dialog initially", () => {
    const { unmount } = renderWithProvider();
    expect(screen.queryByText("Delete Item")).not.toBeInTheDocument();
    unmount();
  });

  it("shows dialog when confirm is called", async () => {
    const { unmount } = renderWithProvider();
    await userEvent.click(screen.getByText("Trigger"));
    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    unmount();
  });

  it("resolves true when confirmed", async () => {
    let result: boolean | undefined;
    const { unmount } = renderWithProvider((r) => { result = r; });
    await userEvent.click(screen.getByText("Trigger"));
    await userEvent.click(screen.getByText("Yes"));
    expect(result).toBe(true);
    expect(screen.queryByText("Delete Item")).not.toBeInTheDocument();
    unmount();
  });

  it("resolves false when cancelled", async () => {
    let result: boolean | undefined;
    const { unmount } = renderWithProvider((r) => { result = r; });
    await userEvent.click(screen.getByText("Trigger"));
    await userEvent.click(screen.getByText("No"));
    expect(result).toBe(false);
    expect(screen.queryByText("Delete Item")).not.toBeInTheDocument();
    unmount();
  });
});
