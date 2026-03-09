export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER";
  createdAt: string;
};