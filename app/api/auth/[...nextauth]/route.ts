import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db"
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "username" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {

        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const { rows } = await pool.query(
            `SELECT id, username, password FROM users 
             WHERE username = $1`,
            [credentials.username]
          );

          if (rows.length === 0) return null;
          const user = rows[0];

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          return isValid ? { id: user.id, name: user.username } : null; 
        } catch (error) {
          console.error("Database error:", error);
          return null; 
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/projects",
    error: "/login",
  },
});

export { handler as GET, handler as POST };
