import { login } from '@/api/auth/login';
import { AuthOptions } from 'next-auth';
import { User as IUser } from '@/types/User';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserProfile } from '@/api/profile/getUserProfile';

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
  pages: {
    newUser: '/auth/sign-up',
  },
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

        const user = await getUserProfile(response.jwt);

        if ('error' in response) return null;

        return {
          ...user,
          id: user.id.toString(),
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
