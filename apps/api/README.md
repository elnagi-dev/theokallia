# @theokallia/api
> NestJS REST API for Theokallia

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

## 📦 Overview
- NestJS REST API for auth, users, categories, products, reviews, cart, and wishlist.
- Orders, payments, and upload are next.
- Port `3333`; Swagger UI at `localhost:3333/docs`.
- Deployed to Render via `@theokallia/api/Dockerfile`.

## 🚀 Quick Start
```bash
pnpm install
```
1. Set `@theokallia/api/.env`.
2. Run the API.

## 🗂️ Repository Layout
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

## 🔌 Current Endpoints

### Auth
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

### Users
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | `/users/me` | `JwtAuthGuard` | Returns current user (no password) |
| PATCH | `/users/me` | `JwtAuthGuard` | Updates firstName, lastName, email, phone, address |

### Categories
| Status | Source |
|---|---|
| Complete, 8 endpoints, seeded | `@theokallia/api/src/categories/` |

### Products
| Status | Source |
|---|---|
| Complete, 6 endpoints, 12 products seeded | `@theokallia/api/src/products/` |

### Reviews
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| POST | `/products/:slug/reviews` | `JwtAuthGuard` | Create — one per user per product |
| GET | `/products/:slug/reviews` | public | Get all reviews + computed rating summary |
| PATCH | `/products/:slug/reviews/:reviewId` | `JwtAuthGuard` | Update own review only |
| DELETE | `/products/:slug/reviews/:reviewId` | `JwtAuthGuard` | Delete own — admin can delete any |

### Cart
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | `/cart` | `JwtAuthGuard` | Get full cart with items, product details, computed total |
| POST | `/cart` | `JwtAuthGuard` | Add item — increments if exists, validates combined stock |
| PATCH | `/cart/:itemId` | `JwtAuthGuard` | Update quantity — validates against stock |
| DELETE | `/cart/:itemId` | `JwtAuthGuard` | Remove single item |
| DELETE | `/cart/clear` | `JwtAuthGuard` | Clear all items (used after checkout) |
| POST | `/cart/merge` | `JwtAuthGuard` | Merge guest localStorage cart into DB cart after login |
| POST | `/cart/validate-guest` | public | Return current stock for a list of productIds — used by guest cart hydration |

### Wishlist
| Method | Endpoint | Guard | Description |
|---|---|---|---|
| GET | `/wishlist` | `JwtAuthGuard` | Get full wishlist with product details. Creates empty wishlist if none exists |
| POST | `/wishlist/toggle` | `JwtAuthGuard` | Add if not present, remove if already there. Returns `{ wishlisted: boolean, wishlist }` |
| POST | `/wishlist/merge` | `JwtAuthGuard` | Merge guest localStorage productIds into DB wishlist after login. Skips duplicates |
| DELETE | `/wishlist/:itemId` | `JwtAuthGuard` | Remove specific item by WishlistItem id |

## 🔐 Authentication
- httpOnly cookies: `access_token` + `refresh_token`.
- Access token lifetime: `15m`.
- Refresh token lifetime: `7d`.
- `req.user` shape: `{ userId: string, email: string, role: string }`.
- Access token is extracted from the `access_token` httpOnly cookie and verified against `JWT_ACCESS_SECRET`.

| Guard | File | Purpose |
|---|---|---|
| `JwtAuthGuard` | `auth/guards/jwt-auth.guard.ts` | Verifies access token, populates `req.user` |
| `RolesGuard` | `auth/guards/roles.guard.ts` | Checks `req.user.role` against `@Roles()` decorator |

## ⚙️ Environment Variables
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

## 🚢 Deployment
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

## 📚 Documentation
| Document | Link |
|---|---|
| API architecture | [`apps/api/docs/architecture.md`](apps/api/docs/architecture.md) |
| API rules | [`apps/api/docs/rules.md`](apps/api/docs/rules.md) |
