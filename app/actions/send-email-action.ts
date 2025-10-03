'use server';

import nodemailer from 'nodemailer';

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
  const subjects = {
    'sign-in': 'Войдите в ваш аккаунт',
    'email-verification': 'Подтвердите вашу почту',
    'forget-password': 'Сброс пароля',
  };

  const messages = {
    'sign-in': `Ваш код для входа: <strong>${otp}</strong>`,
    'email-verification': `Ваш код подтверждения почты: <strong>${otp}</strong>`,
    'forget-password': `Ваш код для сброса пароля: <strong>${otp}</strong>`,
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
              <p>Этот код действителен в течение 1 минуты.</p>
              <p>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
              <div class="footer">
                <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
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
