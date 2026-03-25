import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEditState } from "./useEditState";

describe("useEditState", () => {
  it("starts with editing false", () => {
    const { result } = renderHook(() => useEditState());
    expect(result.current.editing).toBe(false);
  });

  it("sets editing to true on open", () => {
    const { result } = renderHook(() => useEditState());
    act(() => result.current.open());
    expect(result.current.editing).toBe(true);
  });

  it("sets editing to false on close", () => {
    const { result } = renderHook(() => useEditState());
    act(() => result.current.open());
    act(() => result.current.close());
    expect(result.current.editing).toBe(false);
  });
});
