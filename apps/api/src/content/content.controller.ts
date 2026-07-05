import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AllowAnonymous } from '@thallesp/nestjs-better-auth'
import { ContentService } from './content.service'
import { CreateContentBlockDto } from './dto/create-content-block.dto'
import { UpdateContentBlockDto } from './dto/update-content-block.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/guards/roles.guard'

/**
 * Content controller drives the CMS backbone of the homepage.
 * Public endpoints serve section data to the frontend for dynamic rendering.
 * Admin endpoints (POST/PATCH/DELETE) power the homepage builder in the dashboard.
 */
@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  /**
   * GET /content — returns all blocks sorted by sortOrder.
   * The frontend calls this on page load to render hero, promotions, banners, etc.
   * No auth required — homepage must load for all visitors.
   */
  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'List all content blocks sorted by sortOrder' })
  findAll() {
    return this.contentService.findAll()
  }

  /**
   * GET /content/:section — returns a single block by section key.
   * Useful for page-level fetching if only one section is needed.
   */
  @Get(':section')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Get a single content block by section name' })
  findOne(@Param('section') section: string) {
    return this.contentService.findBySection(section)
  }

  /**
   * POST /content — creates a new homepage section.
   * Admin only. Section must be unique — duplicate returns 409.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new content block (admin only)' })
  create(@Body() dto: CreateContentBlockDto) {
    return this.contentService.create(dto)
  }

  /**
   * PATCH /content/:section — updates an existing section's content.
   * Admin only. Used by the homepage builder to edit hero copy, CTAs, etc.
   */
  @Patch(':section')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a content block by section (admin only)' })
  update(@Param('section') section: string, @Body() dto: UpdateContentBlockDto) {
    return this.contentService.update(section, dto)
  }

  /**
   * DELETE /content/:section — removes a section and its associated assets.
   * Admin only. Cascading delete handles the polymorphic Asset cleanup.
   */
  @Delete(':section')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a content block by section (admin only)' })
  delete(@Param('section') section: string) {
    return this.contentService.delete(section)
  }
}
