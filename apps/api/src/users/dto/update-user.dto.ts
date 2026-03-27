import { IsString, IsOptional, MinLength } from 'class-validator'

// DTO = Data Transfer Object
// It defines the shape and validation rules for data coming into the API
// class-validator decorators automatically validate incoming request bodies
// thanks to the global ValidationPipe in main.ts
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  // Optional — user may update only their name
  name?: string
}