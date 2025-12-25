interface OrganizationInvitationEmailProps {
  email: string
  invitedByUsername: string
  invitedByEmail: string
  teamName: string
  inviteLink: string
}

export default function OrganizationInvitationEmail({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: OrganizationInvitationEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>You've been invited to join {teamName}</h1>
      <p>
        {invitedByUsername} ({invitedByEmail}) has invited you to join the
        organization {teamName}.
      </p>
      <p>
        <a href={inviteLink}>Accept invitation</a>
      </p>
    </div>
  )
}

