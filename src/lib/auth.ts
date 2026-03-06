import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;

        const result = await query(
          "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1", 
          [credentials.email]
        );
        const user = result.rows[0];

        if (user && await bcrypt.compare(credentials.senha, user.senha_hash)) {
          return { id: user.id.toString(), name: user.nome, email: user.email };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const result = await query("SELECT id FROM usuarios WHERE email = $1", [user.email]);
          if (result.rows.length === 0) {
            await query(
              "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, NULL)",
              [user.name, user.email]
            );
          }
        } catch (error) {
          console.error("Erro no login Google:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      const result = await query("SELECT id FROM usuarios WHERE email = $1", [session.user?.email]);
      if (result.rows[0]) {
        session.user.id = result.rows[0].id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  }
};