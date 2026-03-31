import { API_VERSION } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  // resolve the dynamic path segments
  // e.g. /api/auth/login → path = ['auth', 'login']
  const { path } = await params

  // reconstruct the full NestJS URL with version
  // e.g. http://localhost:3333/v1/auth/login
  const url = `${process.env.API_URL}/${API_VERSION}/${path.join('/')}`

  // forward the request to NestJS
  const res = await fetch(url, {
    method: req.method,

    headers: {
      'Content-Type': 'application/json',
      // forward the browser's cookies to NestJS so JwtAuthGuard can read access_token
      cookie: req.headers.get('cookie') ?? '',
    },

    // only attach a body for non-GET/HEAD requests (GET has no body)
    body:
      req.method !== 'GET' && req.method !== 'HEAD'
        ? await req.text()
        : undefined,
  })

  // parse the NestJS response — catch handles empty responses (e.g. 204 No Content)
  const data = await res.json().catch(() => null)

  // build the Next.js response, preserving the NestJS status code
  const response = NextResponse.json(data, { status: res.status })

  // forward ALL set-cookie headers from NestJS back to the browser
  // using forEach + append instead of get() because get() only returns the first cookie
  // this ensures both access_token and refresh_token cookies are forwarded correctly
  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      response.headers.append('set-cookie', value)
    }
  })

  return response
}

// export each HTTP method — they all go through the same handler
export const GET = handler
export const POST = handler
export const PATCH = handler
export const PUT = handler
export const DELETE = handler