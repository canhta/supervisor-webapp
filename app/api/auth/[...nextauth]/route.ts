import { ENDPOINT_URL, NEXTAUTH_SECRET } from '@/constants';
import { DefaultUser, NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

interface TokenResponse {
  token: string;
  refreshToken: string;
  tokenExpires: number;
  user?: DefaultUser;
}

const refreshToken = async (tokens: JWT): Promise<JWT> => {
  const res = await fetch(`${ENDPOINT_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${tokens.refreshToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch refresh token');
  }

  const response: TokenResponse = await res.json();

  return { ...tokens, ...response };
};

const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      id: 'email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const res = await fetch(`${ENDPOINT_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        if (!res.ok) {
          throw new Error('Failed to login');
        }

        return await res.json();
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      if (params.user) {
        params.token = params.user as unknown as JWT;
      }

      if (params.token) {
        const tokenExpires = params.token.tokenExpires as number;
        const currentDate = new Date().getTime();

        if (tokenExpires <= currentDate) {
          return await refreshToken(params.token);
        }
      }

      return params.token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
