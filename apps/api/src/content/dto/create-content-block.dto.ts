import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator'

/**
 * DTO for creating a new homepage content block.
 * Section is required and must be unique — it identifies which part of the
 * homepage this block controls (hero, promotions, banners, featured).
 * Everything else is optional so the admin dashboard can save partial drafts.
 */
export class CreateContentBlockDto {
  /** Unique section identifier. Matches the key the frontend uses to render. */
  @ApiProperty({ example: 'hero' })
  @IsString()
  section: string

  /** Main heading displayed on the section (e.g. 'Discover Divine Beauty'). */
  @ApiPropertyOptional({ example: 'Discover Divine Beauty' })
  @IsOptional()
  @IsString()
  title?: string

  /** Supporting text below the heading. */
  @ApiPropertyOptional({ example: 'Handcrafted luxury jewellery for the modern woman.' })
  @IsOptional()
  @IsString()
  subtitle?: string

  /** Button label (e.g. 'Shop Now', 'Explore Collection'). */
  @ApiPropertyOptional({ example: 'Shop Now' })
  @IsOptional()
  @IsString()
  ctaText?: string

  /** Internal link the CTA button navigates to. */
  @ApiPropertyOptional({ example: '/shop' })
  @IsOptional()
  @IsString()
  ctaLink?: string

  /** Display order among all sections — lower values appear first. */
  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number

  /** Whether this section is currently visible on the homepage. */
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}
