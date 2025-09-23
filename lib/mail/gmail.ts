import crypto from 'node:crypto'

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function signJwtRS256(header: object, payload: object, privateKeyPem: string) {
  const encHeader = b64url(JSON.stringify(header))
  const encPayload = b64url(JSON.stringify(payload))
  const data = `${encHeader}.${encPayload}`
  const signature = crypto.createSign('RSA-SHA256').update(data).end().sign(privateKeyPem)
  return `${data}.${b64url(signature)}`
}

async function getAccessToken(scope: string, subjectEmail: string) {
  const clientEmail = process.env.GMAIL_SA_CLIENT_EMAIL
  let privateKey = process.env.GMAIL_SA_PRIVATE_KEY
  const tokenUri = process.env.GMAIL_SA_TOKEN_URI || 'https://oauth2.googleapis.com/token'
  if (!clientEmail || !privateKey) throw new Error('Gmail service account env not configured')
  // Handle escaped newlines in env
  privateKey = privateKey.replace(/\\n/g, '\n')

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iss: clientEmail,
    scope,
    aud: tokenUri,
    iat: now,
    exp: now + 3600,
    sub: subjectEmail,
  }
  const assertion = signJwtRS256(header, payload, privateKey)
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  })
  const res = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`)
  const json = await res.json()
  return json.access_token as string
}

function buildMime({ from, to, subject, html }: { from: string; to: string[]; subject: string; html: string }) {
  const headers = [
    `From: ${from}`,
    `To: ${to.join(', ')}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
  ]
  return `${headers.join('\r\n')}\r\n\r\n${html}`
}

export async function sendGmail({ to, subject, html }: { to: string[]; subject: string; html: string }) {
  const from = process.env.GMAIL_IMPERSONATE_EMAIL || 'info@arcontractglazing.com'
  if (!to?.length) throw new Error('No recipients provided')
  const scope = 'https://www.googleapis.com/auth/gmail.send'
  const accessToken = await getAccessToken(scope, from)
  const raw = b64url(buildMime({ from, to, subject, html }))
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gmail send failed: ${res.status} ${text}`)
  }
}

