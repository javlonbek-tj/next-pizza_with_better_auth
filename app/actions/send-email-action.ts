'use server';

import nodemailer from 'nodemailer';
import { otpTemplate, subjects } from '@/lib';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOTPEmail(
  to: string,
  otp: string,
  type: 'sign-in' | 'email-verification' | 'forget-password'
) {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject: subjects[type],
      html: otpTemplate(type, otp),
    });
  } catch (error) {
    // TODO REMOVE IN PRODUCTION
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}
