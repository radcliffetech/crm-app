// app/lib/permissions.ts
import { User } from "~/types";

export const canAccessAdmin = (user: User) => user.role === "admin";
export const canAccessFaculty = (user: User) => user.role === "faculty" || user.role === "admin";
export const canAccessStudent = (user: User) => user.role === "student" || user.role === "admin";


