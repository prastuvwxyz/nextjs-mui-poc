import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          hd: process.env.NEXT_PUBLIC_COMPANY_DOMAIN // Restrict to company domain
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store additional user info
      if (account && profile) {
        token.role = (profile as any).role || 'user';
        token.department = (profile as any).department || 'general';
      }
      return token;
    },
    async session({ session, token }) {
      // Pass role to client
      (session.user as any).role = token.role;
      (session.user as any).department = token.department;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
};