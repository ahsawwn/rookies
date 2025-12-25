interface VerifyEmailProps {
  username: string
  verifyUrl: string
}

export default function VerifyEmail({
  username,
  verifyUrl,
}: VerifyEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Verify your email</h1>
      <p>Hello {username},</p>
      <p>Please verify your email address by clicking the link below:</p>
      <p>
        <a href={verifyUrl}>Verify email</a>
      </p>
      <p>If you didn't create an account, please ignore this email.</p>
    </div>
  )
}

