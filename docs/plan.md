# Theokallia Build Plan
This document is the authoritative reference for the current build state and future direction of Theokallia.

## 1. Current Build State
| Feature | Status | Source Verification |
|---|---|---|
| Auth module | Complete, 9 endpoints | `@theokallia/api/src/auth/`, Section 4 |
| Users module | Complete, 2 endpoints | `@theokallia/api/src/users/`, Section 5 |
| Categories module | Complete, 8 endpoints, seeded | `@theokallia/api/src/categories/`, Section 19 |
| Products module | Complete, 6 endpoints, 12 seeded | `@theokallia/api/src/products/`, Section 20 |
| Reviews module | Complete, 4 endpoints | `@theokallia/api/src/reviews/`, Section 21 |
| Cart module | Complete, 7 endpoints | `@theokallia/api/src/cart/`, Section 11 |
| Wishlist module | Complete, 4 endpoints | `@theokallia/api/src/wishlist/`, Section 12 |
| Orders module | Not started | `@theokallia/api/src/orders/`, Section 29 |
| Payments module | Not started | `@theokallia/api/src/payments/`, Section 29 |
| Upload module | Not started | `@theokallia/api/src/upload/`, Section 29 |
| PrismaService | `@Global()`, `.client` getter | `@theokallia/api/src/prisma/`, Section 27 |
| RedisService | `@Global()` | `@theokallia/api/src/redis/`, Section 27 |
| MailService | BullMQ processor | `@theokallia/api/src/mail/`, Sections 13 and 27 |
| Neon PostgreSQL schema | Fully built | `@theokallia/api/prisma/schema.prisma`, Section 10 |
| App pages | layout, shop, cart, wishlist, about, contact, proxy | `@theokallia/web/app/`, Section 15 |
| Auth components | Fully built | `@theokallia/web/components/auth/`, Section 15 |
| Profile components | Fully built | `@theokallia/web/components/profile/`, Section 15 |
| Cart components | Fully built | `@theokallia/web/components/cart/`, Section 15 |
| Wishlist components | Fully built | `@theokallia/web/components/wishlist/`, Section 15 |
| Shop components | Fully built | `@theokallia/web/components/shop/`, Section 15 |
| Product components | Fully built | `@theokallia/web/components/product/`, Section 15 |
| Hooks | `use-auth`, `use-cart`, `use-wishlist`, `use-products`, `use-reviews`, `use-categories`, `use-profile` | `@theokallia/web/lib/hooks/`, Section 15 |
| Stores | `auth-store`, `guest-cart-store`, `guest-wishlist-store` | `@theokallia/web/lib/stores/`, Sections 15 and 16 |
| Admin dashboard | Not started | `apps/admin/`, Sections 4 and 29 |
| Render deployment | API deployed | Section 13 |
| Vercel deployment | Frontend hosted | Section 13 |
| Neon PostgreSQL | Active | Sections 2, 3, 13 |
| Upstash Redis | Active | Sections 2, 3, 13 |
| CI/CD pipeline | Not started | Section 29 |
| Switch mail to Resend | Not started | Section 29 |
| Turborepo Remote Caching | Not started | Section 29 |

## 2. Phase Completion Status
| Phase | Original Plan | Status | Remaining |
|---|---|---|---|
| Phase 1 | Auth, users, categories, products, reviews | ✅ Done | None |
| Phase 2 | Cart, wishlist | ✅ Done | None |
| Phase 3 | Orders, payments | ❌ Not started | Full implementation |
| Phase 4 | Upload, admin dashboard | ❌ Not started | Cloudinary service, `apps/admin` build |
| Phase 5 | Production hardening | ❌ Not started | Redis caching, Resend, CI/CD, Turborepo Remote Caching |

## 3. Immediate Next Items
1. Orders module — OrdersService, OrdersController, OrdersModule
2. Order DTOs — CreateOrderDto, OrderItemDto
3. Orders endpoints — POST /orders, GET /orders, GET /orders/:id
4. prisma.$transaction — create order + items + decrement stock atomically
5. Paystack payment init — POST /payments/initialize
6. Paystack webhook — POST /payments/webhook (verify signature, create order on charge.success)
7. BullMQ send-order-confirmation job

## 4. Open Decisions
- Review submission form UI — deferred until profile/admin polish
- Admin review block — `ForbiddenException` in `ReviewsService.create` + `userRole` param, deferred until review form is built
- `ProductShipping` config endpoint — deferred until admin panel is built
- Google OAuth — `passport-google-oauth20`, deferred
- Guest wishlist `validate-guest` endpoint — deferred unless stale `inStock` becomes a real user complaint
- Buy Now on `product-info.tsx` — deferred until checkout page is built
- Le Jour Serif commercial license — must be verified before launch

## 5. Known Technical Debt
- No API rate limiting — `@nestjs/throttler` installed but not configured
- No Redis caching on `GET /products` — placeholder only
- Mail still on Gmail SMTP — Resend switch deferred to production
- No CI/CD pipeline
- No Turborepo Remote Caching
- Admin review block not implemented — `ForbiddenException` check missing from `ReviewsService.create`

## 6. Phase Roadmap
### Phase 1: Core Platform (Complete)
- Auth, users, categories, products, reviews, cart, wishlist
- NestJS backend deployed to Render
- Next.js frontend deployed to Vercel
- Neon PostgreSQL + Upstash Redis active

### Phase 2: Commerce (Current)
- Orders module
- Paystack payments (initialize + webhook)
- BullMQ order confirmation email

### Phase 3: Admin & Upload
- Cloudinary upload service
- `apps/admin` — separate Next.js app with Shadcn
- Admin dashboard — products, orders, users, categories
- Shipping config endpoint

### Phase 4: Production Hardening
- Redis caching on `GET /products`
- Switch mail to Resend
- Rate limiting configuration
- Turborepo Remote Caching
- CI/CD pipeline
