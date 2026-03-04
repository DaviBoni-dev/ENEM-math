import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // ... mantenha o código anterior do seu CredentialsProvider aqui
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;

        // Procura o usuário no teu Postgres
        const result = await query("SELECT * FROM usuarios WHERE email = $1", [credentials.email]);
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
        // Engenharia: Verifica se o usuário do Google já existe no seu Postgres
        const result = await query("SELECT id FROM usuarios WHERE email = $1", [user.email]);
        
        if (result.rows.length === 0) {
          // Se não existir, criamos ele automaticamente (sem senha, pois é login social)
          await query(
            "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3)",
            [user.name, user.email, 'google-auth-no-password']
          );
        }
      }
      return true;
    },
    async session({ session, token }) {
      // Busca o ID real do banco para usar no Dashboard
      const result = await query("SELECT id FROM usuarios WHERE email = $1", [session.user?.email]);
      if (result.rows[0]) {
        session.user.id = result.rows[0].id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  }
});

export { handler as GET, handler as POST };


