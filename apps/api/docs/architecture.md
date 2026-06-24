# @theokallia/api — Architecture
> NestJS Backend Technical Reference
> Version: 1.0
> Status: Active

## Table of Contents
1. [Overview](#1-overview)
2. [Module Structure](#2-module-structure)
3. [`main.ts` Configuration](#3-maints-configuration)
4. [Auth Module](#4-auth-module)
5. [Users Module](#5-users-module)
6. [Categories Module](#6-categories-module)
7. [Products Module](#7-products-module)
8. [Reviews Module](#8-reviews-module)
9. [Cart Module](#9-cart-module)
10. [Wishlist Module](#10-wishlist-module)
11. [Prisma Module](#11-prisma-module)
12. [Redis Module](#12-redis-module)
13. [Mail Module](#13-mail-module)
14. [Database Schema](#14-database-schema)
15. [Environment Variables](#15-environment-variables)
16. [Deployment](#16-deployment)

## 1. Overview
`@theokallia/api` is the NestJS REST API for Theokallia. It runs on port `3333`, exposes Swagger at `localhost:3333/docs`, and is deployed to Render using `@theokallia/api/Dockerfile`.

`PrismaModule` and `RedisModule` are `@Global()`. Prisma uses the `.client` getter pattern. All routes use NestJS URI versioning on `/v1/`.

## 2. Module Structure
```text
apps/api/src/
├── main.ts                       ✅ Helmet, cookieParser, CORS, ValidationPipe (enableImplicitConversion: true), Swagger, VersioningType.URI
├── app.module.ts                 ✅ ConfigModule, BullModule, PrismaModule, RedisModule, MailModule, AuthModule, UsersModule, CategoriesModule, ProductsModule, ReviewsModule, CartModule, WishlistModule
├── auth/                         ✅ all 9 endpoints complete
├── users/                        ✅ GET /users/me, PATCH /users/me
├── categories/                   ✅ all 8 endpoints, seeded
├── products/                     ✅ all 6 endpoints, 12 products seeded
├── reviews/                      ✅ all 4 endpoints complete
├── cart/                         ✅ all 7 endpoints complete
├── wishlist/                     ✅ all 4 endpoints complete
│   ├── wishlist.module.ts
│   ├── wishlist.controller.ts    ← @UseGuards(JwtAuthGuard) at class level — all endpoints require auth
│   ├── wishlist.service.ts
│   └── dto/
│       ├── toggle-wishlist.dto.ts
│       └── merge-wishlist.dto.ts
├── prisma/                       ✅ @Global(), exposes .client getter
├── redis/                        ✅ @Global()
└── mail/                         ✅ BullMQ processor

apps/api/src/ to be built: orders/ (next — prisma.$transaction), payments/ (Paystack init + webhook), upload/ (Cloudinary image upload)
```

## 3. `main.ts` Configuration
```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
)
```

Registered in `main.ts`: Helmet, cookieParser, CORS, global ValidationPipe, Swagger, `VersioningType.URI`.

`VersioningType` is imported from `@nestjs/common`, not `@nestjs/core`.

## 4. Auth Module
### Endpoints
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Store pending data in Redis, queue OTP email |
| POST | `/auth/verify-otp` | public | Verify OTP, create user in DB, issue tokens |
| POST | `/auth/resend-otp` | public | Generate new OTP, reset Redis TTLs |
| POST | `/auth/login` | public | Verify password, issue tokens, set cookies |
| POST | `/auth/refresh` | public | Rotate refresh token, issue new access token |
| POST | `/auth/logout` | public | Delete refresh token from DB, clear cookies |
| POST | `/auth/forgot-password` | public | Generate reset OTP, store in Redis, queue reset email |
| POST | `/auth/verify-reset-otp` | public | Verify reset OTP, issue reset grant in Redis |
| POST | `/auth/reset-password` | public | Validate grant, update password, invalidate all sessions |

### Flows
```text
POST /auth/register — { firstName, lastName, email, password }
  → check if verified user exists with this email → 409 if so
  → if unverified DB record exists (old flow) → delete it
  → hash password with bcryptjs (10 rounds)
  → store pending-registration:{email} in Redis (TTL 300s)
  → generate 4-digit OTP and store otp:{email} in Redis (TTL 300s)
  → queue 'send-otp' job

POST /auth/verify-otp — { email, otp }
  → read otp:{email}
  → if missing/wrong → 401 Unauthorized
  → read pending-registration:{email}
  → if missing → 401 'Registration session expired. Please register again.'
  → prisma.$transaction create User (emailVerified: true, role: 'customer')
  → delete otp:{email} and pending-registration:{email}
  → sign access token (15min)
  → sign + hash + store refresh token (7d)
  → set access_token + refresh_token httpOnly cookies

POST /auth/resend-otp — { email }
  → read pending-registration:{email}
  → if missing → 404 'No pending registration found. Please register again.'
  → generate new 4-digit OTP
  → reset otp:{email} TTL to 300s
  → reset pending-registration:{email} TTL to 300s
  → queue 'send-otp' job

POST /auth/login — { email, password }
  → find user by email
  → if emailVerified = false → 403 'Please verify your email'
  → bcryptjs.compare(password, user.password)
  → if wrong → 401 'Invalid credentials'
  → prisma.$transaction deleteMany existing refresh tokens for user
  → sign + hash + store new refresh token
  → set access_token + refresh_token httpOnly cookies

POST /auth/forgot-password — { email }
  → find user by email (don't reveal if not found)
  → generate 4-digit OTP
  → store reset:{email} in Redis (TTL 300s)
  → queue 'send-reset-otp' job

POST /auth/verify-reset-otp — { email, otp }
  → read reset:{email}
  → if missing/wrong → 401 Unauthorized
  → delete reset:{email}
  → store reset-grant:{email} = '1' (TTL 600s)

POST /auth/reset-password — { email, password }
  → read reset-grant:{email}
  → if missing → 401 'Reset session expired. Please start again.'
  → find user by email
  → hash new password
  → update user.password
  → delete reset-grant:{email}
  → deleteMany refresh tokens for user
```

### JWT Strategy
```ts
{ userId: string, email: string, role: string }
```
Access token is extracted from the `access_token` httpOnly cookie and verified against `JWT_ACCESS_SECRET`.

### Guards
| Guard | File | Purpose |
|---|---|---|
| `JwtAuthGuard` | `auth/guards/jwt-auth.guard.ts` | Verifies access token, populates `req.user` |
| `RolesGuard` | `auth/guards/roles.guard.ts` | Checks `req.user.role` against `@Roles()` decorator |

### Cookie Security
Tokens are stored as httpOnly cookies and are never accessible via JavaScript.

### Redis Keys
| Key | TTL |
|---|---|
| `pending-registration:{email}` | 5min |
| `otp:{email}` | 5min |
| `reset:{email}` | 5min |
| `reset-grant:{email}` | 10min |

## 5. Users Module
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | `/users/me` | `JwtAuthGuard` | Returns current user (no password) |
| PATCH | `/users/me` | `JwtAuthGuard` | Updates firstName, lastName, email, phone, address |

`AuthUser` type:
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

## 6. Categories Module
```text
Rings        → Gold Rings, Silver Rings, Diamond Rings
Bracelets    → Gold Bracelets, Silver Bracelets, Charm Bracelets
Necklaces    → Gold Necklaces, Silver Necklaces, Pendant Necklaces
Earrings     → Gold Earrings, Silver Earrings, Hoop Earrings
```

## 7. Products Module
| Name | Category | Price |
|---|---|---|
| Adaeze | Rings | ₦45,000 |
| Zara | Rings | ₦120,000 |
| Emeka | Rings | ₦18,000 |
| Temi | Bracelets | ₦55,000 |
| Chisom | Bracelets | ₦38,000 |
| Nkechi | Bracelets | ₦25,000 |
| Amara | Necklaces | ₦62,000 |
| Obiageli | Necklaces | ₦85,000 |
| Sade | Necklaces | ₦22,000 |
| Ife | Earrings | ₦42,000 |
| Folake | Earrings | ₦30,000 |
| Ngozi | Earrings | ₦15,000 |

PrismaService pattern:
```ts
this.prisma.client.product.findMany(...)
```

## 8. Reviews Module
### Endpoints
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| POST | `/products/:slug/reviews` | `JwtAuthGuard` | Create — one per user per product |
| GET | `/products/:slug/reviews` | public | Get all reviews + computed rating summary |
| PATCH | `/products/:slug/reviews/:reviewId` | `JwtAuthGuard` | Update own review only |
| DELETE | `/products/:slug/reviews/:reviewId` | `JwtAuthGuard` | Delete own — admin can delete any |

One review per user per product.

### Deferred — Admin Review Block
```ts
if (userRole === 'admin') {
  throw new ForbiddenException('Admins cannot leave reviews on products')
}
```
Update controller call: `this.reviewsService.create(slug, req.user.userId, req.user.role, dto)`

## 9. Cart Module
### Endpoints
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | `/cart` | `JwtAuthGuard` | Get full cart with items, product details, computed total |
| POST | `/cart` | `JwtAuthGuard` | Add item — increments if exists, validates combined stock |
| PATCH | `/cart/:itemId` | `JwtAuthGuard` | Update quantity — validates against stock |
| DELETE | `/cart/:itemId` | `JwtAuthGuard` | Remove single item |
| DELETE | `/cart/clear` | `JwtAuthGuard` | Clear all items (used after checkout) |
| POST | `/cart/merge` | `JwtAuthGuard` | Merge guest localStorage cart into DB cart after login |
| POST | `/cart/validate-guest` | public | Return current stock for a list of productIds — used by guest cart hydration |

### Controller Guard Pattern
`@UseGuards(JwtAuthGuard)` is applied per-method because `POST /cart/validate-guest` is public.

### `getCart` Stock Write-Back
`getCart` caps each item's quantity against current `product.stock`. If any quantities changed, writes them back to DB immediately.

### Guest Cart Architecture
```text
localStorage (persistent)
    ↕ read/write on every action
Zustand store (reactive)
    ↕ components subscribe
navbar badge, product card, cart page — all reactive, no refresh needed
```

### Stock Validation Layers
| Layer | Where | What it does |
|---|---|---|
| UI disable | `product-card.tsx`, `product-info.tsx` | Disables button when `quantityInCart >= product.stock` |
| Guest storage cap | `cart-storage.ts` `addToGuestCart` | `Math.min(newQty, existing.stock)` on increment |
| Guest hydration cap | `guest-cart-store.ts` `hydrate` | Fetches fresh stock from API, caps and writes back |
| Guest storage update cap | `cart-storage.ts` `updateGuestCartItem` | `Math.min(quantity, existing.stock)` before writing |
| Backend addItem | `cart.service.ts` | Validates `existingQty + dto.quantity <= product.stock` |
| Backend updateItem | `cart.service.ts` | Validates `dto.quantity <= product.stock` |
| Backend merge | `cart.service.ts` | `Math.min(existingQty + guestQty, product.stock)` |
| Backend getCart write-back | `cart.service.ts` | Caps and writes back to DB if cart quantity exceeds current stock |

### Guest Cart Merge
On login, `useLogin` reads guest items, posts to `POST /cart/merge`, clears localStorage + Zustand, invalidates `['cart']`.

## 10. Wishlist Module
### Endpoints
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | `/wishlist` | `JwtAuthGuard` | Get full wishlist with product details. Creates empty wishlist if none exists |
| POST | `/wishlist/toggle` | `JwtAuthGuard` | Add if not present, remove if already there. Returns `{ wishlisted: boolean, wishlist }` |
| POST | `/wishlist/merge` | `JwtAuthGuard` | Merge guest localStorage productIds into DB wishlist after login. Skips duplicates |
| DELETE | `/wishlist/:itemId` | `JwtAuthGuard` | Remove specific item by WishlistItem id |

### Controller Guard Pattern
`@UseGuards(JwtAuthGuard)` at class level — all wishlist endpoints require auth.

### Business Rules
- One item per product per wishlist.
- No quantity.
- `toggle` returns `{ wishlisted: boolean, wishlist }`.
- Ownership check on `removeItem` uses intentionally vague 404 for mismatched userId.

### Guest Wishlist Architecture
```text
localStorage (persistent) — stores full product objects
    ↕ read/write on every action
Zustand store (reactive)
    ↕ components subscribe
navbar badge, wishlist page, cart items — all reactive
```

### Why it differs from cart
Full objects are stored so the wishlist page can render immediately from localStorage without any API call. There is no `validate-guest` because wishlist items are binary.

### `silent` Toast Param
`useToggleWishlist(isAuthenticated, silent = false)` suppresses the built-in toast when `silent=true`.

### Toast Responsibility Map
| Action | Where toast fires | Message |
|---|---|---|
| Heart icon click (add) | `useToggleWishlist` `onMutate` / `mutationFn` | `${name} added to wishlist` |
| Heart icon click (remove) | `useToggleWishlist` `onMutate` / `mutationFn` | `${name} removed from wishlist` |
| Toggle fails | `useToggleWishlist` `onError` | `Couldn't update wishlist for ${name}` |
| Remove button on wishlist page | `wishlist-item.tsx` `handleRemove` | `${name} removed from wishlist` |
| Remove fails | `useRemoveWishlistItem` `onError` | `Couldn't remove item from wishlist` |
| Move to Bag | `wishlist-item.tsx` `handleMoveToBag` | `${name} moved to bag` |
| Move to Wishlist from cart | `cart-item.tsx` / `guest-cart-item.tsx` | `${name} moved to wishlist` |

### Guest Wishlist Merge
On login, `useLogin` reads `getGuestWishlist()`, extracts `p.id`, posts to `POST /wishlist/merge`, clears localStorage + Zustand, invalidates `['wishlist']`.

## 11. Prisma Module
- `@Global()`.
- Exposes `.client` getter.
- Critical usage rule: `this.prisma.client.xyz` always.

## 12. Redis Module
- `@Global()`.
- Keys and TTLs:
| Key | TTL |
|---|---|
| `pending-registration:{email}` | 5min |
| `otp:{email}` | 5min |
| `reset:{email}` | 5min |
| `reset-grant:{email}` | 10min |

## 13. Mail Module
- BullMQ processor.

| Job Name | Data | Description |
|---|---|---|
| `send-otp` | `{ email, otp }` | OTP verification email |
| `send-reset-otp` | `{ email, otp }` | Password reset email |
| `send-order-confirmation` | TBD | Order confirmation (to be implemented) |

Retry config: 3 retries, exponential backoff.

Never call `nodemailer.sendMail()` directly.

## 14. Database Schema
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

## 15. Environment Variables
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

## 16. Deployment
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

Render uses the Dockerfile above.
