// app/types/User.ts
export type UserRole = "admin" | "faculty" | "student";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}