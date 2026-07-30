import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const installationId = request.nextUrl.searchParams.get('installation_id')
  const setupAction = request.nextUrl.searchParams.get('setup_action')

  console.log('1')

  // TODO: add error page with "try again" button
  if (!installationId) {
    return NextResponse.redirect(
      new URL('/error?reason=missing_installation', request.url),
    )
  }

  console.log('2')

  const res = await fetch(
    `${process.env.BACKEND_URL}/verify-installation?installation_id=${installationId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  )

  console.log('3')

  if (!res.ok) {
    console.log(res)
    return NextResponse.redirect(
      new URL('/error?reason=verification_failed', request.url),
    )
  }

  console.log('4')

  const data = await res.json()
  console.log('data', data)

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
