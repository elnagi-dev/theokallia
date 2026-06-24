# THEOKALLIA — Technical Architecture Document
> Engineering Blueprint — v1.0
> Version: 1.0
> Status: Active

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Monorepo Structure](#2-monorepo-structure)
3. [Technology Stack](#3-technology-stack)
4. [Database Schema](#4-database-schema)
5. [Shared Types](#5-shared-types)
6. [API Contract](#6-api-contract)
7. [Authentication Architecture](#7-authentication-architecture)
8. [Cart Architecture](#8-cart-architecture)
9. [Wishlist Architecture](#9-wishlist-architecture)
10. [On App Load](#10-on-app-load)
11. [Infrastructure & Environment Variables](#11-infrastructure--environment-variables)
12. [Deployment](#12-deployment)
13. [BullMQ Email Queue](#13-bullmq-email-queue)
14. [Filter, Sort & Pagination](#14-filter-sort--pagination)
15. [Shop & Product Page Architecture](#15-shop--product-page-architecture)

## 1. System Overview
Theokallia is a full-stack luxury jewellery e-commerce platform with three surfaces: `theokallia.com`, `api.theokallia.com`, and `apps/admin`.

```text
Browser
  → Next.js App Router (`apps/web`)
  → catch-all proxy `apps/web/app/api/[...path]/route.ts`
  → NestJS REST API (`/v1/...`)
  → Neon PostgreSQL / Upstash Redis
  → BullMQ mail queue → Nodemailer
```

Architecture principles from the README:
- Use URI versioning on all NestJS routes (`/v1/`).
- Forward `cookie`, `set-cookie`, and `req.nextUrl.search` through the proxy.
- Keep `cache: 'no-store'` on the proxy.
- Use `PrismaService.client` for database access.
- Use `prisma.$transaction` callback form for multi-step DB work.
- Use Zustand for guest cart and guest wishlist state.
- Use React Query for authenticated cart and wishlist state.
- Use `lib/api.ts` for all API calls; do not use raw `fetch` in hooks or stores.
- Push `'use client'` deep and keep `ShopPage` as a server component.

## 2. Monorepo Structure
```text
apps/
├── api/
│   ├── Dockerfile
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── auth/
│       ├── users/
│       ├── categories/
│       ├── products/
│       ├── reviews/
│       ├── cart/
│       ├── wishlist/
│       ├── prisma/
│       ├── redis/
│       └── mail/
├── web/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── shop/page.tsx
│   │   ├── shop/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── api/[...path]/route.ts
│   ├── components/
│   │   ├── providers/
│   │   ├── auth/
│   │   ├── profile/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── shop/
│   │   ├── product/
│   │   └── ui/
│   └── lib/
│       ├── api.ts
│       ├── cart-storage.ts
│       ├── wishlist-storage.ts
│       ├── stores/
│       ├── hooks/
│       └── validations/
└── admin/ (to be built)

packages/
├── types/
│   └── (User/AuthUser types)
└── db/ (stub only)
```

## 3. Technology Stack
| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Package manager | pnpm |
| Frontend | Next.js 16.2 |
| Language | TypeScript |
| CSS | Tailwind v4 |
| UI components | Shadcn UI |
| Icons | Lucide React |
| State management | Zustand |
| Data fetching | TanStack React Query |
| Forms | React Hook Form + Zod |
| HTTP client | axios |
| API versioning | NestJS URI versioning |
| Backend | NestJS |
| ORM | Prisma v7 |
| Database | Neon PostgreSQL |
| Auth | Custom NestJS Auth |
| Auth sessions | httpOnly cookies |
| Password hashing | bcryptjs |
| OTP storage | Upstash Redis |
| Pending registration | Upstash Redis |
| Reset OTP storage | Upstash Redis |
| Reset grant storage | Upstash Redis |
| Refresh tokens | `RefreshToken` DB table |
| Email queue | BullMQ + Upstash Redis |
| Email sender | Nodemailer |
| Guest cart | Zustand + localStorage |
| Guest wishlist | Zustand + localStorage |
| Caching | Upstash Redis |
| Rate limiting | `@nestjs/throttler` |
| Validation | `class-validator` + `class-transformer` |
| Deployment | Render |
| Google OAuth | Deferred |
| Payments | Paystack |
| File storage | Cloudinary |

## 4. Database Schema
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String         @id @default(cuid())
  firstName      String
  lastName       String
  email          String         @unique
  password       String
  role           String         @default("customer")
  emailVerified  Boolean        @default(false)
  phone          String?
  address        String?
  orders         Order[]
  reviews        Review[]
  refreshTokens  RefreshToken[]
  cart           Cart?
  wishlist       Wishlist?
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
}

model Category {
  id            String        @id @default(cuid())
  name          String
  slug          String        @unique
  image         String?
  subcategories Subcategory[]
  products      Product[]
  createdAt     DateTime      @default(now())
}

model Subcategory {
  id         String    @id @default(cuid())
  name       String
  slug       String    @unique
  image      String?
  category   Category  @relation(fields: [categoryId], references: [id])
  categoryId String
  products   Product[]
  createdAt  DateTime  @default(now())
}

model Product {
  id            String         @id @default(cuid())
  name          String
  slug          String         @unique
  description   String
  price         Float
  images        String[]
  inStock       Boolean        @default(true)
  stock         Int            @default(0)
  category      Category       @relation(fields: [categoryId], references: [id])
  categoryId    String
  subcategory   Subcategory?   @relation(fields: [subcategoryId], references: [id])
  subcategoryId String?
  orderItems    OrderItem[]
  reviews       Review[]
  cartItems     CartItem[]
  wishlistItems WishlistItem[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Review {
  id        String   @id @default(cuid())
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  rating    Int
  comment   String
  createdAt DateTime @default(now())
}

model Cart {
  id        String     @id @default(cuid())
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String     @unique
  items     CartItem[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(cuid())
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  cartId    String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([cartId, productId])
}

model Wishlist {
  id        String         @id @default(cuid())
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String         @unique
  items     WishlistItem[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}

model WishlistItem {
  id         String   @id @default(cuid())
  wishlist   Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  wishlistId String
  product    Product  @relation(fields: [productId], references: [id])
  productId  String
  createdAt  DateTime @default(now())

  @@unique([wishlistId, productId])
}

model Order {
  id        String      @id @default(cuid())
  user      User        @relation(fields: [userId], references: [id])
  userId    String
  status    String      @default("pending")
  total     Float
  items     OrderItem[]
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Float
}
```

**Schema notes:**
- `rating` and `reviewCount` NOT stored on `Product` — computed from `Review` table at query time
- `price` on `OrderItem` is a snapshot — history unaffected by price changes
- No `OtpCode` model — Redis handles OTP entirely
- `RefreshToken.token` stores a bcrypt hash — never the raw token
- `Cart` is one-per-user (`userId @unique`), created lazily via upsert on first cart access
- `CartItem` has `@@unique([cartId, productId])` — one entry per product per cart
- `Wishlist` is one-per-user (`userId @unique`), created lazily via upsert on first wishlist access
- `WishlistItem` has `@@unique([wishlistId, productId])` — one entry per product per wishlist, no quantity

## 5. Shared Types
```ts
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'customer' | 'admin'
  emailVerified: boolean
  phone?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export type AuthUser = Omit<User, 'createdAt' | 'updatedAt'>
```
`@theokallia/api` does NOT import from `@theokallia/types` — it uses a local `src/types/user.ts` copy.

## 6. API Contract
| Base | URL |
|---|---|
| Local web | `http://localhost:3000` |
| Local API | `http://localhost:3333/v1` |
| Production web | `https://theokallia.com` |
| Production API | `https://api.theokallia.com/v1` |

### Auth
| Method | Endpoint | Guard |
|---|---|---|
| POST | `/auth/register` | public |
| POST | `/auth/verify-otp` | public |
| POST | `/auth/resend-otp` | public |
| POST | `/auth/login` | public |
| POST | `/auth/refresh` | public |
| POST | `/auth/logout` | public |
| POST | `/auth/forgot-password` | public |
| POST | `/auth/verify-reset-otp` | public |
| POST | `/auth/reset-password` | public |

### Users
| Method | Endpoint | Guard |
|---|---|---|
| GET | `/users/me` | `JwtAuthGuard` |
| PATCH | `/users/me` | `JwtAuthGuard` |

### Categories
| Status | Source |
|---|---|
| Complete, 8 endpoints, seeded | `@theokallia/api/src/categories/` |
Source README does not enumerate the individual category routes.

### Products
| Status | Source |
|---|---|
| Complete, 6 endpoints, 12 seeded | `@theokallia/api/src/products/` |
Source README does not enumerate the individual product routes.

### Reviews
| Method | Endpoint | Guard |
|---|---|---|
| POST | `/products/:slug/reviews` | `JwtAuthGuard` |
| GET | `/products/:slug/reviews` | public |
| PATCH | `/products/:slug/reviews/:reviewId` | `JwtAuthGuard` |
| DELETE | `/products/:slug/reviews/:reviewId` | `JwtAuthGuard` |

### Cart
| Method | Endpoint | Guard |
|---|---|---|
| GET | `/cart` | `JwtAuthGuard` |
| POST | `/cart` | `JwtAuthGuard` |
| PATCH | `/cart/:itemId` | `JwtAuthGuard` |
| DELETE | `/cart/:itemId` | `JwtAuthGuard` |
| DELETE | `/cart/clear` | `JwtAuthGuard` |
| POST | `/cart/merge` | `JwtAuthGuard` |
| POST | `/cart/validate-guest` | public |

### Wishlist
| Method | Endpoint | Guard |
|---|---|---|
| GET | `/wishlist` | `JwtAuthGuard` |
| POST | `/wishlist/toggle` | `JwtAuthGuard` |
| POST | `/wishlist/merge` | `JwtAuthGuard` |
| DELETE | `/wishlist/:itemId` | `JwtAuthGuard` |

### Catch-All Proxy
`@theokallia/web/app/api/[...path]/route.ts`
```typescript
import { API_VERSION } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const search = req.nextUrl.search
  const url = `${process.env.API_URL}/${API_VERSION}/${path.join('/')}${search}`

  const res = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      cookie: req.headers.get('cookie') ?? '',
    },
    body:
      req.method !== 'GET' && req.method !== 'HEAD'
        ? await req.text()
        : undefined,
    cache: 'no-store',
  })

  const data = await res.json().catch(() => null)
  const response = NextResponse.json(data, { status: res.status })

  res.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      response.headers.append('set-cookie', value)
    }
  })

  return response
}

export const GET = handler
export const POST = handler
export const PATCH = handler
export const PUT = handler
export const DELETE = handler
```
Critical rules:
- `req.nextUrl.search` MUST be appended or query params are dropped.
- `cache: 'no-store'` MUST be set.
- `cookie` MUST be forwarded for `JwtAuthGuard`.
- `set-cookie` MUST be forwarded back with `forEach` + `append`.

## 7. Authentication Architecture
### Auth endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Store pending data in Redis, queue OTP email |
| POST | `/auth/verify-otp` | Verify OTP, create user in DB, issue tokens |
| POST | `/auth/resend-otp` | Generate new OTP, reset Redis TTLs |
| POST | `/auth/login` | Verify password, issue tokens, set cookies |
| POST | `/auth/refresh` | Rotate refresh token, issue new access token |
| POST | `/auth/logout` | Delete refresh token from DB, clear cookies |
| POST | `/auth/forgot-password` | Generate reset OTP, store in Redis, queue reset email |
| POST | `/auth/verify-reset-otp` | Verify reset OTP, issue reset grant in Redis |
| POST | `/auth/reset-password` | Validate grant, update password, invalidate all sessions |

### Flows
```text
Register
POST /auth/register { firstName, lastName, email, password }
  → verify user does not already exist
  → delete old unverified DB record if present
  → bcryptjs hash password (10 rounds)
  → store pending-registration:{email} in Redis (300s)
  → generate 4-digit OTP and store otp:{email} in Redis (300s)
  → queue send-otp job

Verify OTP
POST /auth/verify-otp { email, otp }
  → read otp:{email} and pending-registration:{email}
  → create User (emailVerified: true, role: 'customer')
  → delete Redis keys
  → sign access token (15m)
  → sign + hash + store refresh token (7d)
  → set access_token + refresh_token cookies

Resend OTP
POST /auth/resend-otp { email }
  → require pending registration
  → generate new OTP
  → reset otp:{email} and pending-registration:{email} TTLs to 300s
  → queue send-otp job

Login
POST /auth/login { email, password }
  → reject unverified users
  → compare password with bcryptjs
  → delete existing refresh tokens
  → sign/store new refresh token
  → set cookies
  → frontend merges guest cart and guest wishlist on success

Forgot Password
POST /auth/forgot-password { email }
  → generate 4-digit OTP
  → store reset:{email} in Redis (300s)
  → queue send-reset-otp job

Verify Reset OTP
POST /auth/verify-reset-otp { email, otp }
  → validate reset OTP
  → delete reset:{email}
  → store reset-grant:{email} = '1' (600s)

Reset Password
POST /auth/reset-password { email, password }
  → validate reset grant
  → hash and update password
  → delete reset-grant:{email}
  → delete all refresh tokens
```

### JWT strategy
```ts
{ userId: string, email: string, role: string }
```
Access token is extracted from the `access_token` httpOnly cookie and verified against `JWT_ACCESS_SECRET`.

### Guards
| Guard | File | Purpose |
|---|---|---|
| `JwtAuthGuard` | `auth/guards/jwt-auth.guard.ts` | Verifies access token, populates `req.user` |
| `RolesGuard` | `auth/guards/roles.guard.ts` | Checks `req.user.role` against `@Roles()` |

### Cookie security
Tokens are stored as httpOnly cookies and are never accessible via JavaScript.

## 8. Cart Architecture
### Dual cart strategy
```text
Guest cart
localStorage → Zustand store → components subscribe

Authenticated cart
React Query `['cart']` cache → API
```

### Guest cart data flow
```text
localStorage (persistent)
  ↕ read/write on every action
Zustand store (reactive)
  ↕ components subscribe
navbar badge, product card, cart page
```

### Stock validation layers
| Layer | Where | What it does |
|---|---|---|
| UI disable | `product-card.tsx`, `product-info.tsx` | Disables when `quantityInCart >= product.stock` |
| Guest storage cap | `cart-storage.ts` `addToGuestCart` | `Math.min(newQty, existing.stock)` |
| Guest hydration cap | `guest-cart-store.ts` `hydrate` | Fetches fresh stock, caps, writes back |
| Guest storage update cap | `cart-storage.ts` `updateGuestCartItem` | `Math.min(quantity, existing.stock)` |
| Backend addItem | `cart.service.ts` | Validates `existingQty + dto.quantity <= product.stock` |
| Backend updateItem | `cart.service.ts` | Validates `dto.quantity <= product.stock` |
| Backend merge | `cart.service.ts` | `Math.min(existingQty + guestQty, product.stock)` |
| Backend getCart write-back | `cart.service.ts` | Caps and persists current stock |

### Merge on login
`useLogin` reads guest items, posts to `POST /cart/merge`, clears localStorage + Zustand, invalidates `['cart']`.

### `validate-guest`
`POST /cart/validate-guest` returns current stock for a list of productIds and is used by guest cart hydration.

## 9. Wishlist Architecture
### Dual wishlist strategy
```text
Guest wishlist
localStorage (full product objects) → Zustand store → components subscribe

Authenticated wishlist
React Query `['wishlist']` cache → API
```

### Why it differs from cart
- Stores full product objects so the wishlist page can render immediately from localStorage.
- Hydration is sync; no API call is needed.
- There is no `validate-guest` because wishlist items have no quantity.

### Guest wishlist data flow
```text
localStorage (persistent) — full product objects
  ↕ read/write on every action
Zustand store (reactive)
  ↕ components subscribe
navbar badge, wishlist page, cart items
```

### Merge on login
`useLogin` reads `getGuestWishlist()`, extracts `p.id`, posts to `POST /wishlist/merge`, clears localStorage + Zustand, invalidates `['wishlist']`.

### `silent` toast param
`useToggleWishlist(isAuthenticated, silent = false)` suppresses the built-in toast when `silent=true`, so callers can fire their own toast.

### Toast responsibility map
| Action | Where toast fires | Message |
|---|---|---|
| Heart icon click (add) | `useToggleWishlist` `onMutate` / `mutationFn` | `${name} added to wishlist` |
| Heart icon click (remove) | `useToggleWishlist` `onMutate` / `mutationFn` | `${name} removed from wishlist` |
| Toggle fails | `useToggleWishlist` `onError` | `Couldn't update wishlist for ${name}` |
| Remove button on wishlist page | `wishlist-item.tsx` `handleRemove` | `${name} removed from wishlist` |
| Remove fails | `useRemoveWishlistItem` `onError` | `Couldn't remove item from wishlist` |
| Move to Bag | `wishlist-item.tsx` `handleMoveToBag` | `${name} moved to bag` |
| Move to Wishlist from cart | `cart-item.tsx` / `guest-cart-item.tsx` | `${name} moved to wishlist` |

## 10. On App Load
```ts
void hydrateGuestCart()
hydrateWishlist()
```

### Guest cart hydration
1. Reads localStorage.
2. Calls `POST /cart/validate-guest` with all productIds.
3. API returns fresh `{ productId, stock, inStock }`.
4. Caps quantities that exceed current stock.
5. Writes capped values back to localStorage.
6. Sets Zustand state.

### Guest wishlist hydration
1. Reads localStorage.
2. Gets saved guest wishlist products (full objects).
3. Sets Zustand state directly.
4. Navbar badge updates immediately.

### Authenticated flow
`AuthProvider` fires `GET /users/me`; if valid, `isAuthenticated` becomes `true`, `useCart` and `useWishlist` enable, and both fire their fetches with `staleTime: 0`.

### On login
1. `setUser` fires.
2. Guest cart merges via `POST /cart/merge` and clears state.
3. Guest wishlist merges via `POST /wishlist/merge` and clears state.
4. Both caches refetch with merged DB data.

## 11. Infrastructure & Environment Variables
### Services map
| Service | Provider | Purpose |
|---|---|---|
| PostgreSQL | Neon | Primary database |
| Redis | Upstash | OTP, pending registration, reset OTP, reset grant, caching, BullMQ |
| API hosting | Render | NestJS deployment |
| Frontend hosting | Vercel | Next.js deployment |
| Image storage | Cloudinary | Product image uploads |
| Email (dev) | Gmail SMTP / Nodemailer | Development mail |
| Email (production) | Resend | Production mail (deferred) |
| Payments | Paystack | Nigerian payment processor |

### `@theokallia/api/.env`
```env
NODE_ENV=development
PORT=3333
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...neon.tech/neondb?sslmode=verify-full
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=rediss://default:...@upstash.io:6379
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-gmail@gmail.com
MAIL_PASS=your-16-char-app-password
MAIL_FROM=your-gmail@gmail.com
```

### `@theokallia/web/.env.local`
```env
API_URL=http://localhost:3333
```

## 12. Deployment
### Render Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile
COPY . .
WORKDIR /app/apps/api
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm build
EXPOSE 3333
CMD ["node", "/app/apps/api/dist/src/main"]
```

### Vercel frontend setup
- `API_URL` is set in the Vercel dashboard.
- It is server-side only and has no `NEXT_PUBLIC_` prefix.

## 13. BullMQ Email Queue
| Job Name | Data | Description |
|---|---|---|
| `send-otp` | `{ email, otp }` | OTP verification email |
| `send-reset-otp` | `{ email, otp }` | Password reset email |
| `send-order-confirmation` | TBD | Order confirmation (to be implemented) |

Retry config: 3 retries with exponential backoff.

Planned: `send-order-confirmation` remains to be implemented.

## 14. Filter, Sort & Pagination
| Param | Type | Default | Description |
|---|---|---|---|
| `category` | string | all | comma-separated slugs e.g. `rings,bracelets` |
| `minPrice` | number | none | lower bound in Naira |
| `maxPrice` | number | none | upper bound in Naira |
| `sort` | string | none | `best-seller` or `new-arrival` |
| `order` | string | `desc` | `asc` or `desc` — backend only |
| `page` | number | `1` | current page |
| `limit` | number | `12` | items per page |

## 15. Shop & Product Page Architecture
`ShopPage` is a simple server component: no `searchParams`, no filter parsing, no props to `ProductGrid`. `SidebarFilter` and `ProductGrid` read from `useSearchParams` directly.

```text
shop/[slug]/page.tsx ('use client')
  ├── useProduct(slug) → name, price, images, description, category
  ├── useReviews(slug) → rating, reviewCount, ratingBreakdown, reviews list
  ├── [grid: 2 cols]
  │   ├── ProductImages
  │   └── [flex col]
  │       ├── ProductInfo(product) → full product object
  │       └── ProductShipping → hardcoded (DHL, 3-5 days, Nigeria)
  ├── [ratings + reviews]
  │   ├── if reviewCount > 0: ProductRatingSummary + ProductReviews
  │   └── if reviewCount === 0: empty state
  └── SimilarProducts(slug) → slug as prop, not useParams()
```
