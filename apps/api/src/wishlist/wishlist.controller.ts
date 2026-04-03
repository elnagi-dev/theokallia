import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ToggleWishlistDto } from './dto/toggle-wishlist.dto'
import { WishlistService } from './wishlist.service'
import { MergeWishlistDto } from './dto/merge-wishlist.dto'

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Get()
  @ApiOperation({
    summary: 'Get the current user\'s wishlist',
    description: 'Returns the wishlist with all saved items and their product details. Creates an empty wishlist if one does not exist yet.',
  })
  @ApiResponse({ status: 200, description: 'Wishlist returned successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  getWishlist(@Req() req: Request) {
    return this.wishlistService.getWishlist((req.user as any)['userId'])
  }

  @Post('toggle')
  @ApiOperation({
    summary: 'Toggle a product in the wishlist',
    description: 'Adds the product to the wishlist if it is not there, removes it if it already is. Returns { wishlisted: boolean, wishlist } so the frontend can update the heart icon immediately without a separate GET.',
  })
  @ApiResponse({ status: 201, description: 'Toggled. Check wishlisted field in response.' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  toggleItem(@Req() req: Request, @Body() dto: ToggleWishlistDto) {
    return this.wishlistService.toggleItem((req.user as any)['userId'], dto)
  }

  @Post('merge')
  @ApiOperation({
    summary: 'Merge localStorage wishlist into DB wishlist after login',
    description: 'Called immediately after login if the guest had wishlisted products. Adds any products not already in the DB wishlist. Already-wishlisted products are skipped. Frontend clears localStorage after this call.',
  })
  @ApiResponse({ status: 201, description: 'Wishlists merged, full DB wishlist returned' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  mergeWishlist(@Req() req: Request, @Body() dto: MergeWishlistDto) {
    return this.wishlistService.mergeWishlist((req.user as any)['userId'], dto)
  }

  @Delete(':itemId')
  @ApiOperation({
    summary: 'Remove a specific wishlist item',
    description: 'Removes a wishlist item by its WishlistItem ID. Prefer POST /wishlist/toggle for normal UI interactions — use this only when you have a specific itemId to target.',
  })
  @ApiParam({ name: 'itemId', description: 'The ID of the WishlistItem to remove' })
  @ApiResponse({ status: 200, description: 'Item removed, updated wishlist returned' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Wishlist item not found' })
  removeItem(@Req() req: Request, @Param('itemId') itemId: string) {
    return this.wishlistService.removeItem((req.user as any)['userId'], itemId)
  }
}