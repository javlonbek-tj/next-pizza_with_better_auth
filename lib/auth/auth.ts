import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { sendOTPEmail } from '@/app/actions/auth/send-email-action';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from '@/server/prisma';
import { mergeCartsOnLogin } from '@/server/data/cart';
import { USER_ROLES } from '@/lib/constants';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: USER_ROLES.USER,
      },
    },
  },
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
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || [];
          if (ADMIN_EMAILS.includes(user.email)) {
            return {
              data: {
                ...user,
                role: USER_ROLES.ADMIN,
              },
            };
          }
        },
      },
    },
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
