import { login } from '@/api/auth/login';
import { AuthOptions } from 'next-auth';
import { User as IUser } from '@/types/User';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SESSION_MAX_AGE } from './sessionMaxAge';
import { getUserProfile } from '@/api/profile/getUserProfile';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import { githubCallback } from '@/api/profile/getUserGuthubProfile';

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
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
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
    async jwt({ token, user, trigger, account }) {
      console.log('JWT', { token, user, account });

      // when user signs in with github
      if (account?.provider === 'github') {
        try {
          const githubUser = await githubCallback(token.user.accessToken);

          token.user = {
            ...token.user,
            ...githubUser,
          };
        } catch (err) {
          console.error('GitHub backend sync failed:', err);
        }
      }
      if (user) {
        token.user = {
          ...user,
          id: Number(user.id),
        };
      }

      if (user && account?.provider === 'google') {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/google-custom`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name || 'User',
              }),
            }
          );
          if (!res.ok) {
            console.error('Strapi returned error', res.status);
            throw new Error('Strapi login failed');
          }
          const data = await res.json();
          console.log('Strapi response', data);
          token.user = {
            ...user,
            id: user.sub,
            name: user.name || 'User',
            accessToken: data.jwt || '',
          };
        } catch (err) {
          console.error('JWT fetch error', err);
          throw err;
        }
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
