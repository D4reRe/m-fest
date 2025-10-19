import NextAuth, { type DefaultSession } from "next-auth";

enum Education {
  SMA = "SMA",
  SMK = "SMK",
  D3 = "D3",
  S1 = "S1",
}
declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    user: {
      // user default data from Auth.js
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;

      // The user's additional datas
      phoneNumber?: string | null;
      domicile?: string | null;
      institution?: string | null;
      education?: Education | null;
      semester?: int | null;
      birthDate?: Date | null;
    } & DefaultSession["user"];
  }
  // interface User extends DefaultUser {
  //   id: string;
  //   phoneNumber?: string | null;
  //   domicile?: string | null;
  //   institution?: string | null;
  //   education?: string | null;
  //   semester?: string | null;
  //   birthDate?: Date | null;
  // }
}
