import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const installationId = request.nextUrl.searchParams.get('installation_id')
  const setupAction = request.nextUrl.searchParams.get('setup_action')

  // TODO: add error page with "try again" button
  if (!installationId) {
    return NextResponse.redirect(
      new URL('/error?reason=missing_installation', request.url),
    )
  }

  const res = await fetch(
    `${process.env.BACKEND_URL}/verify-installation?installation_id=${installationId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  )

  if (!res.ok) {
    console.log(res)
    return NextResponse.redirect(
      new URL('/error?reason=verification_failed', request.url),
    )
  }

  const data = await res.json()

  const response = NextResponse.redirect(new URL('/dashboard', request.url))

  response.cookies.set('session', data.session_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 21,
  })

  return response
}
