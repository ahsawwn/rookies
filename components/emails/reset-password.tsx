interface ForgotPasswordEmailProps {
  username: string
  resetUrl: string
  userEmail: string
}

export default function ForgotPasswordEmail({
  username,
  resetUrl,
  userEmail,
}: ForgotPasswordEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Reset your password</h1>
      <p>Hello {username},</p>
      <p>You requested to reset your password for {userEmail}.</p>
      <p>
        <a href={resetUrl}>Reset password</a>
      </p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  )
}

