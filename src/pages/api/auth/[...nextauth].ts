import { UsersService } from "@/server/modules/users/user.service";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing Email or Password.");
        }

        const usersService = new UsersService();

        const result = await usersService.findByEmail(credentials.email);
        if (!result) {
          throw new Error("Invalid Email or Password.");
        }
        if (result.currentEmploymentStatusId === 4) {
          throw new Error(
            "Your Account has been deactivated. Please contact admin team.",
          );
        }

        const isPasswordCorrect = bcrypt.compareSync(
          credentials.password,
          result.passwordHash,
        );

        if (isPasswordCorrect) {
          // Only return the fields required by NextAuth, and ensure id is a string
          return {
            id: result.id.toString(),
            name: result.fullName,
            email: result.email,
            mangerId: result.managerId,
          };
        }

        throw new Error("Invalid Email or Password.");
      },
    }),
  ],
  pages: {
    signIn: "/auth",
    error: "/auth", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 * 24 * 60 * 60 -> 30 days && 120 -> 2 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
