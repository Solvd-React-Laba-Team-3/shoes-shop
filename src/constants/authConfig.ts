import { login } from '@/api/auth/login';
import { AuthOptions } from 'next-auth';
import { User as IUser } from '@/types/user';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    user: IUser & { accessToken: string };
  }

  interface User extends IUser {
    accessToken: string;
    email: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: IUser & { accessToken: string };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const response = await login({
          identifier: credentials.identifier,
          password: credentials.password,
        });

        if ('error' in response) return null;

        return {
          ...response.user,
          id: response.user.id.toString(),
          accessToken: response.jwt,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          ...user,
          id: Number(user.id),
        };
      }

      return token;
    },

    async session({ token, session }) {
      if (token.user) {
        session.user = {
          ...token.user,
          id: Number(token.user.id),
        };
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },
};
