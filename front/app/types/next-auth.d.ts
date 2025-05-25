// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    _id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: number;
    createdAt?: Date;
    emailVerified?: Date | null;
  }

  interface Session {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
  }
}