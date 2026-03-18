import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { sendOTPEmail } from '@/app/actions/auth/send-email-action';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from './';
import { mergeCartsOnLogin } from './data/cart';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true,
    sendVerificationOnSignUp: true,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session, context) => {
          const guestToken = context?.getCookie('cartToken');
          if (guestToken) {
            await mergeCartsOnLogin(guestToken, session.userId);
          }
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendOTPEmail(email, otp, type);
      },
      sendVerificationOnSignUp: true,
      otpLength: 6,
      expiresIn: 60,
    }),
  ],
});

export type ErrorCodes = typeof auth.$ERROR_CODES | 'UNKNOWN';

export type Session = typeof auth.$Infer.Session;
