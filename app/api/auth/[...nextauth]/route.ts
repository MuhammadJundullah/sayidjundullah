import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { UserType } from "@/lib/type";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error("Username or password missing.");
          return null;
        }

        try {
          const user: UserType | null = await prisma.users.findUnique({
            where: { username: credentials.username },
            select: {
              id: true,
              username: true,
              password: true,
            },
          });

          if (!user) {
            console.error("User not found.");
            return null;
          }

          if (!user.password) {
            console.error("Password hash is missing for the user.");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) {
            console.error("Invalid password.");
            return null;
          }

          return { id: String(user.id), name: user.username };
        } catch (error) {
          console.error("Database error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token?.id) {
          session.user.id = token.id as string;
        }
        if (token?.username) {
          session.user.username = token.username as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});

export { handler as GET, handler as POST };
