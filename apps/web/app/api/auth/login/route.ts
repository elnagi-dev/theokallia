import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_URL

export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  // Forward the cookies NestJS set back to the browser
  const response = NextResponse.json(data)
  const setCookie = res.headers.get('set-cookie')
  if (setCookie) {
    response.headers.set('set-cookie', setCookie)
  }

  return response
}