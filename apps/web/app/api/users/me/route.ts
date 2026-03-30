import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL

// GET /api/users/me 
// Returns the current logged-in user's profile
// Forwards the access_token cookie to NestJS for JWT verification

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value

  console.log('access_token present:', !!accessToken)

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const res = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
  })

  console.log('NestJS response status:', res.status)

  if (!res.ok) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}

// PATCH /api/users/me 
// Updates the current logged-in user's profile
// Forwards the request body and access_token cookie to NestJS

export async function PATCH(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value

  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const res = await fetch(`${API_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${accessToken}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json()
    return NextResponse.json(error, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}