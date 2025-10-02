'use server';

import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
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
  const subjects = {
    'sign-in': 'Sign in to Your App',
    'email-verification': 'Verify your email',
    'forget-password': 'Reset your password',
  };

  const messages = {
    'sign-in': `Your OTP code for signing in is: <strong>${otp}</strong>`,
    'email-verification': `Your email verification code is: <strong>${otp}</strong>`,
    'forget-password': `Your password reset code is: <strong>${otp}</strong>`,
  };

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject: subjects[type],
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .otp-code {
                background-color: #f4f4f4;
                border: 2px dashed #333;
                padding: 15px;
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                margin: 20px 0;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>${subjects[type]}</h2>
              <p>${messages[type]}</p>
              <div class="otp-code">${otp}</div>
              <p>This code will expire in 1 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <div class="footer">
                <p>This is an automated message, please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send verification email');
  }
}
