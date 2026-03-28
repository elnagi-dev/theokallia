import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

// Key used to store roles metadata set by the @Roles() decorator
export const ROLES_KEY = 'roles'

// Decorator to specify which roles are allowed to access a route
// Usage: @Roles('admin')
export function Roles(...roles: string[]) {
  return Reflect.metadata(ROLES_KEY, roles)
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for this route from metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // If no @Roles() decorator is present, allow all authenticated users
    if (!requiredRoles) return true

    // Extract the user from the request (populated by JwtAuthGuard)
    // Role comes directly from JWT payload — no DB lookup needed
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role?: string } }>()

    return requiredRoles.includes(request.user?.role ?? '')
  }
}