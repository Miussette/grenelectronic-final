import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  export type UserRole = "admin" | "customer";

  interface Session {
    user?: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "customer";
  }
}
