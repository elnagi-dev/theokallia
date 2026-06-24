# @theokallia/api — Rules
> NestJS Backend Hard Constraints
> Version: 1.0
> Status: Active

## Guards & Auth
- Use `@UseGuards(JwtAuthGuard)` per-method if ANY endpoint in the controller is public (e.g. cart).
- Use class-level `@UseGuards(JwtAuthGuard)` if ALL endpoints require auth (e.g. wishlist, users).
- `req.user` gives `{ userId, email, role }`; use `userId` to look up `User`.
- Admin routes use `@UseGuards(RolesGuard)` + `@Roles('admin')`.
- `@Roles()` is exported from `auth/guards/roles.guard.ts`.

## DTOs
- All DTOs use `class-validator` decorators.
- `confirmPassword` never appears in a DTO; it is frontend-only via Zod.

## Database
- Multi-step DB operations must use `prisma.$transaction`.
- Use callback form `prisma.$transaction(async (tx) => { ... })` when `await` is needed inside; array form does not support this.

```ts
// correct
this.prisma.client.product.findMany(...)

// wrong — will throw
this.prisma.product.findMany(...)
```

- `PrismaService` uses `.client` getter; always write `this.prisma.client.xyz`.
- `PrismaService` and `RedisService` are `@Global()`; never import their modules in feature modules.

## Modules
- Every module needs `.module.ts`, `.controller.ts`, `.service.ts`, `dto/`.
- Prisma lives in `@theokallia/api/prisma/`; never `@theokallia/db`.

## Email
- Mail via BullMQ only; never call `nodemailer.sendMail()` directly.

## Imports & Types
- Do not import from `@theokallia/types` in `@theokallia/api`.
- `VersioningType` imports from `@nestjs/common`, not `@nestjs/core`.
- `Record<K, V>` always needs both type arguments; never use `as Record<K>` casting.

## Validation
- Keep `enableImplicitConversion: true` in `ValidationPipe`; without it `minPrice`/`maxPrice` arrive as strings.

## Comments
- JSDoc for exported functions, hooks, service methods, store actions describes what, not how.
- Inline comments for non-obvious logic, important decisions, and gotchas only.
- Never comment code that obviously explains itself.
- Never use long separator lines or section dividers inside functions.
- No `// section` divider headers inside function bodies.
