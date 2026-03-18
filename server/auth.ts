import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { sendOTPEmail } from '@/app/actions/auth/send-email-action';
import { emailOTP } from 'better-auth/plugins';
import { prisma } from './';
import { mergeCartsOnLogin } from './data/cart';

const SIGN_IN_PATHS = ['/sign-in/email', '/sign-in/social', '/email-otp/verify-otp'];

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
  hooks: {
    after: [
      {
        matcher: (context) => SIGN_IN_PATHS.includes(context.path),
        handler: async (context) => {
          const session = context.context.session as { userId?: string; session?: { userId?: string } } | null;
          const userId = session?.userId ?? session?.session?.userId;
          const token = context.request?.headers
            .get('cookie')
            ?.match(/cartToken=([^;]+)/)?.[1];

          if (userId && token) {
            await mergeCartsOnLogin(token, userId);
          }
        },
      },
    ],
  },
});

export type ErrorCodes = typeof auth.$ERROR_CODES | 'UNKNOWN';

export type Session = typeof auth.$Infer.Session;
