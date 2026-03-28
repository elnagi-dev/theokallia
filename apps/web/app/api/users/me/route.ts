import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL

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