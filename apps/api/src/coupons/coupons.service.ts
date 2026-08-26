import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ValidateCouponDto, CouponCartItemDto } from './dto/validate-coupon.dto'

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Validates a coupon code against cart contents and returns the discount amount.
   * Used for both pre-flight validation (POST /coupons/validate) and
   * inside createOrder transaction (authoritative server-side check).
   * userId is null for pre-flight (unauthenticated pre-check) — per-user limit check is skipped when null.
   */
  async validateCoupon(
    dto: ValidateCouponDto,
    userId: string | null,
  ): Promise<{ discount: number; type: string; code: string; couponId: string }> {
    // Step 1 — existence and active state (case-insensitive uppercase match)
    const coupon = await this.prisma.client.coupon.findFirst({
      where: { code: dto.code.trim().toUpperCase(), active: true },
    })

    if (!coupon) {
      throw new BadRequestException('Coupon code is invalid or inactive.')
    }

    // Step 2 — expiration check
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Coupon code has expired.')
    }

    // Step 3 — global max uses check
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit has been reached.')
    }

    // Step 4 — per-user limit check (skipped if userId is null)
    if (userId && coupon.perUserLimit !== null) {
      const userUseCount = await this.prisma.client.couponUse.count({
        where: { couponId: coupon.id, userId },
      })
      if (userUseCount >= coupon.perUserLimit) {
        throw new BadRequestException(
          'You have already redeemed this coupon the maximum allowed number of times.',
        )
      }
    }

    // Step 5 — minimum order amount check
    if (coupon.minOrder !== null && dto.subtotal < coupon.minOrder) {
      throw new BadRequestException(
        `Order subtotal of ₦${dto.subtotal.toLocaleString()} does not meet the minimum requirement of ₦${coupon.minOrder.toLocaleString()} for this coupon.`,
      )
    }

    // Step 6 — scope applicability check
    this.checkScope(coupon, dto.items)

    // Calculate discount
    const discount = this.calculateDiscount(coupon, dto.subtotal, dto.items)

    return { discount, type: coupon.type, code: coupon.code, couponId: coupon.id }
  }

  /**
   * Checks whether the coupon scope matches the cart contents.
   * Throws BadRequestException if no cart items qualify for the scoped coupon.
   */
  private checkScope(
    coupon: { scope: string; scopeId: string | null },
    items: CouponCartItemDto[],
  ): void {
    if (coupon.scope === 'storewide') return

    if (coupon.scope === 'category') {
      const hasMatch = items.some((item) => item.categoryId === coupon.scopeId)
      if (!hasMatch) {
        throw new BadRequestException('Coupon applies only to products in the specified category.')
      }
    }

    if (coupon.scope === 'product') {
      const hasMatch = items.some((item) => item.productId === coupon.scopeId)
      if (!hasMatch) {
        throw new BadRequestException(
          'Coupon applies only to a specific product not found in your cart.',
        )
      }
    }
  }

  /**
   * Calculates the discount amount based on coupon type and eligible cart items.
   * For scoped coupons, only qualifying items are included in the eligible subtotal.
   */
  private calculateDiscount(
    coupon: { type: string; value: number; scope: string; scopeId: string | null },
    subtotal: number,
    items: CouponCartItemDto[],
  ): number {
    let eligibleSubtotal = subtotal

    if (coupon.scope === 'category') {
      eligibleSubtotal = items
        .filter((item) => item.categoryId === coupon.scopeId)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    if (coupon.scope === 'product') {
      eligibleSubtotal = items
        .filter((item) => item.productId === coupon.scopeId)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    if (coupon.type === 'percent') {
      return (eligibleSubtotal * coupon.value) / 100
    }

    if (coupon.type === 'fixed') {
      return Math.min(coupon.value, eligibleSubtotal)
    }

    // free_shipping — discount value equals zero here; shippingFee offset handled in createOrder
    return 0
  }
}