import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateContentBlockDto } from './dto/create-content-block.dto'
import { UpdateContentBlockDto } from './dto/update-content-block.dto'

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all content blocks sorted by display order.
   * The admin dashboard uses this to render the homepage builder.
   * Public — the frontend fetches this to render homepage sections dynamically.
   */
  async findAll() {
    return this.prisma.client.contentBlock.findMany({
      orderBy: { sortOrder: 'asc' },
    })
  }

  /**
   * Returns a single content block by its section identifier.
   * Sections are unique (hero, promotions, banners, featured).
   * Throws 404 if the section doesn't exist — caller should handle gracefully.
   */
  async findBySection(section: string) {
    const block = await this.prisma.client.contentBlock.findUnique({
      where: { section },
    })

    if (!block) {
      throw new NotFoundException(`Content block '${section}' not found`)
    }

    return block
  }

  /**
   * Creates a new content block for a section.
   * Sections must be unique — attempting to create a duplicate returns 409.
   * The admin dashboard calls this when adding a new homepage section.
   */
  async create(dto: CreateContentBlockDto) {
    // prevent duplicate sections — each section can only have one block
    const existing = await this.prisma.client.contentBlock.findUnique({
      where: { section: dto.section },
    })

    if (existing) {
      throw new ConflictException(`A content block with section '${dto.section}' already exists`)
    }

    return this.prisma.client.contentBlock.create({ data: dto })
  }

  /**
   * Updates an existing content block by section.
   * If the section field itself is being changed, checks that the new section name
   * isn't already taken — same uniqueness constraint as create.
   */
  async update(section: string, dto: UpdateContentBlockDto) {
    // confirm the block exists before attempting updates
    await this.findBySection(section)

    // if section is being renamed, check the new name isn't taken
    if (dto.section && dto.section !== section) {
      const slugTaken = await this.prisma.client.contentBlock.findUnique({
        where: { section: dto.section },
      })

      if (slugTaken) {
        throw new ConflictException(`A content block with section '${dto.section}' already exists`)
      }
    }

    return this.prisma.client.contentBlock.update({
      where: { section },
      data: dto,
    })
  }

  /**
   * Deletes a content block by section.
   * Cascades to associated assets — polymorphic Asset records with
   * entityType = 'ContentBlock' and matching entityId are also removed.
   */
  async delete(section: string) {
    await this.findBySection(section)

    await this.prisma.client.contentBlock.delete({
      where: { section },
    })

    return { message: `Content block '${section}' deleted successfully` }
  }
}
