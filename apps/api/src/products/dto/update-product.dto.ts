import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator'

// all fields optional — PATCH semantics
export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Temi' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'temi-gold-bracelet' })
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional({ example: 'A beautiful gold bracelet...' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @ApiPropertyOptional({ example: ['https://res.cloudinary.com/...'] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[]

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number

  @ApiPropertyOptional({ example: 'bracelets' })
  @IsOptional()
  @IsString()
  categorySlug?: string

  @ApiPropertyOptional({ example: 'gold-bracelets' })
  @IsOptional()
  @IsString()
  subcategorySlug?: string
}