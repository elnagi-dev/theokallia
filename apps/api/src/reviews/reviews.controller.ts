import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewsService } from './reviews.service'

// extend express Request to include the user populated by JwtAuthGuard
interface AuthenticatedRequest extends Request {
  user: {
    userId: string
    email: string
    role: string
  }
}

@ApiTags('Reviews')
@Controller('products/:slug/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Create Review

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave a review for a product' })
  @ApiParam({ name: 'slug', description: 'Product slug', example: 'temi-gold-bracelets' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorised — not logged in' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'You have already reviewed this product' })
  create(
    @Param('slug') slug: string,
    @Body() dto: CreateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.create(slug, req.user.userId, dto)
  }

  // List Reviews

  @Get()
  @ApiOperation({ summary: 'Get all reviews for a product' })
  @ApiParam({ name: 'slug', description: 'Product slug', example: 'temi-gold-bracelets' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findAll(@Param('slug') slug: string) {
    return this.reviewsService.findAllBySlug(slug)
  }

  // Update Review

  @Patch(':reviewId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update your own review' })
  @ApiParam({ name: 'slug', description: 'Product slug', example: 'temi-gold-bracelets' })
  @ApiParam({ name: 'reviewId', description: 'ID of the review to update' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorised — not logged in' })
  @ApiResponse({ status: 403, description: 'Forbidden — not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  update(
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.update(reviewId, req.user.userId, dto)
  }

  // Delete Review

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review — own review or admin' })
  @ApiParam({ name: 'slug', description: 'Product slug', example: 'temi-gold-bracelets' })
  @ApiParam({ name: 'reviewId', description: 'ID of the review to delete' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorised — not logged in' })
  @ApiResponse({ status: 403, description: 'Forbidden — not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  remove(
    @Param('reviewId') reviewId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.remove(reviewId, req.user.userId, req.user.role)
  }
}