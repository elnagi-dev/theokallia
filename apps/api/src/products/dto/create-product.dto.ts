import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
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

export class CreateProductDto {
  @ApiProperty({ example: 'Temi' })
  @IsString()
  name: string

  @ApiProperty({ example: 'temi-gold-bracelet' })
  @IsString()
  slug: string

  @ApiProperty({ example: 'A beautiful gold bracelet...' })
  @IsString()
  description: string

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  price: number

  @ApiProperty({ example: ['https://res.cloudinary.com/...'] })
  @IsArray()
  @IsUrl({}, { each: true })
  images: string[]

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  stock: number

  // category and subcategory are linked by their slugs — easier than passing IDs
  @ApiProperty({ example: 'bracelets' })
  @IsString()
  categorySlug: string

  @ApiPropertyOptional({ example: 'gold-bracelets' })
  @IsOptional()
  @IsString()
  subcategorySlug?: string
}