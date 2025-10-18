interface Props {
  code: string;
}

export function VerificationUserTemplate({ code }: Props) {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1>Подтверждение регистрации</h1>
      <p>
        Добро пожаловать! Для завершения регистрации введите код подтверждения:
      </p>
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '20px',
          textAlign: 'center',
          margin: '20px 0',
          borderRadius: '8px',
        }}
      >
        <h2
          style={{
            fontSize: '32px',
            margin: '0',
            letterSpacing: '8px',
            color: '#333',
          }}
        >
          {code}
        </h2>
      </div>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Код действителен в течение 1 минуты. Если вы не запрашивали этот код,
        просто проигнорируйте это письмо.
      </p>
    </div>
  );
}
