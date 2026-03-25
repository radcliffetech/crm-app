import { describe, it, expect } from "vitest";
import { canAccessAdmin, canAccessFaculty, canAccessStudent } from "./permissions";
import type { User } from "~/types";

function makeUser(role: User["role"]): User {
  return { id: "1", email: "test@test.com", name: "Test", role };
}

describe("canAccessAdmin", () => {
  it("returns true for admin", () => {
    expect(canAccessAdmin(makeUser("admin"))).toBe(true);
  });
  it("returns false for faculty", () => {
    expect(canAccessAdmin(makeUser("faculty"))).toBe(false);
  });
  it("returns false for student", () => {
    expect(canAccessAdmin(makeUser("student"))).toBe(false);
  });
});

describe("canAccessFaculty", () => {
  it("returns true for admin", () => {
    expect(canAccessFaculty(makeUser("admin"))).toBe(true);
  });
  it("returns true for faculty", () => {
    expect(canAccessFaculty(makeUser("faculty"))).toBe(true);
  });
  it("returns false for student", () => {
    expect(canAccessFaculty(makeUser("student"))).toBe(false);
  });
});

describe("canAccessStudent", () => {
  it("returns true for admin", () => {
    expect(canAccessStudent(makeUser("admin"))).toBe(true);
  });
  it("returns false for faculty", () => {
    expect(canAccessStudent(makeUser("faculty"))).toBe(false);
  });
  it("returns true for student", () => {
    expect(canAccessStudent(makeUser("student"))).toBe(true);
  });
});
