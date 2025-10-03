type OTPType = 'sign-in' | 'email-verification' | 'forget-password';

export const subjects: Record<OTPType, string> = {
  'sign-in': 'Войдите в ваш аккаунт',
  'email-verification': 'Подтвердите вашу почту',
  'forget-password': 'Сброс пароля',
};

export const messages: Record<OTPType, string> = {
  'sign-in': `Ваш код для входа:`,
  'email-verification': `Ваш код подтверждения почты:`,
  'forget-password': `Ваш код для сброса пароля:`,
};

export function otpTemplate(type: OTPType, otp: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
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
          .footer { margin-top: 30px; font-size: 12px; color: #666; }
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
  `;
}
