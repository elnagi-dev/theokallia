import { Controller, Post, Body, Request } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { CouponsService } from './coupons.service'
import { ValidateCouponDto } from './dto/validate-coupon.dto'

/**
 * Coupons controller — exposes pre-flight coupon validation for the checkout UI.
 * Authoritative validation always re-runs inside the createOrder transaction.
 */
@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  /**
   * POST /coupons/validate
   * Pre-flight validation — called by the checkout UI before order submission.
   * Returns discount amount if valid. Public endpoint — userId extracted from session if present.
   */
  @Post('validate')
  async validate(@Body() dto: ValidateCouponDto, @Request() req: any) {
    // Extract userId from session if authenticated — enables per-user limit check
    const userId: string | null = req.user?.id ?? null
    const result = await this.couponsService.validateCoupon(dto, userId)
    return { valid: true, ...result }
  }
}