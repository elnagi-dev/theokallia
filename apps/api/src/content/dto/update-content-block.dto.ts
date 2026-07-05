import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator'

/**
 * DTO for updating a content block — all fields optional (PATCH semantics).
 * If section is changed, the service validates uniqueness against existing blocks.
 */
export class UpdateContentBlockDto {
  /** New section identifier — must not conflict with an existing block. */
  @ApiPropertyOptional({ example: 'hero' })
  @IsOptional()
  @IsString()
  section?: string

  /** Updated main heading. */
  @ApiPropertyOptional({ example: 'Discover Divine Beauty' })
  @IsOptional()
  @IsString()
  title?: string

  /** Updated supporting text. */
  @ApiPropertyOptional({ example: 'Handcrafted luxury jewellery for the modern woman.' })
  @IsOptional()
  @IsString()
  subtitle?: string

  /** Updated CTA button label. */
  @ApiPropertyOptional({ example: 'Shop Now' })
  @IsOptional()
  @IsString()
  ctaText?: string

  /** Updated CTA link URL. */
  @ApiPropertyOptional({ example: '/shop' })
  @IsOptional()
  @IsString()
  ctaLink?: string

  /** Updated sort order among sections. */
  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number

  /** Toggle section visibility on the homepage. */
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean
}
