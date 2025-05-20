import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Here we're hardcoding a simple check for username/password
        // In a real app, you would validate against a database
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin"
        ) {
          return {
            id: "1",
            name: "Administrator",
            email: "admin@example.com",
          };
        }

        throw new Error("Invalid username or password.");
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
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
