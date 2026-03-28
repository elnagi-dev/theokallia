import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value

  const res = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Forward the refresh token cookie to NestJS
      Cookie: refreshToken ? `refresh_token=${refreshToken}` : '',
    },
  })

  const data = await res.json()

  // Clear cookies on the browser side
  const response = NextResponse.json(data)
  response.cookies.delete('access_token')
  response.cookies.delete('refresh_token')

  return response
}