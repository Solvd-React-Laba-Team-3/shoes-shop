import { login } from '@/api/auth/login';
import { AuthOptions } from 'next-auth';
import { User as IUser } from '@/types/User';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SESSION_MAX_AGE } from './sessionMaxAge';
import { getUserProfile } from '@/api/profile/getUserProfile';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';

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
    signIn: '/auth/sign-in',
    newUser: '/auth/sign-up',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
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

        return {
          ...user,
          id: user.id.toString(),
          accessToken: response.jwt,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.user = {
          ...user,
          id: Number(user.id),
        };
      }

      if (trigger === 'update') {
        const updatedUser = await getUserProfile(token.user.accessToken);

        token.user = {
          ...updatedUser,
          accessToken: token.user.accessToken,
          id: Number(token.user.id),
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
    maxAge: SESSION_MAX_AGE,
  },
};
