import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CreateSubcategoryDto } from './dto/create-subcategory.dto'
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Categories

  async findAllCategories() {
    return this.prisma.client.category.findMany({
      include: {
        subcategories: {
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })
  }

  async findOneCategory(slug: string) {
    const category = await this.prisma.client.category.findUnique({
      where: { slug },
      include: {
        subcategories: {
          orderBy: { name: 'asc' },
        },
      },
    })

    if (!category) {
      throw new NotFoundException(`Category '${slug}' not found`)
    }

    return category
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.prisma.client.category.findUnique({
      where: { slug: dto.slug },
    })

    if (existing) {
      throw new ConflictException(`A category with slug '${dto.slug}' already exists`)
    }

    return this.prisma.client.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        image: dto.image,
      },
      include: {
        subcategories: true,
      },
    })
  }

  async updateCategory(slug: string, dto: UpdateCategoryDto) {
    await this.findOneCategory(slug)

    if (dto.slug && dto.slug !== slug) {
      const slugTaken = await this.prisma.client.category.findUnique({
        where: { slug: dto.slug },
      })

      if (slugTaken) {
        throw new ConflictException(`A category with slug '${dto.slug}' already exists`)
      }
    }

    return this.prisma.client.category.update({
      where: { slug },
      data: {
        name: dto.name,
        slug: dto.slug,
        image: dto.image,
      },
      include: {
        subcategories: true,
      },
    })
  }

  async deleteCategory(slug: string) {
    await this.findOneCategory(slug)

    await this.prisma.client.category.delete({
      where: { slug },
    })

    return { message: `Category '${slug}' deleted successfully` }
  }

  // Subcategories

  async createSubcategory(categorySlug: string, dto: CreateSubcategoryDto) {
    const category = await this.findOneCategory(categorySlug)

    const existing = await this.prisma.client.subcategory.findUnique({
      where: { slug: dto.slug },
    })

    if (existing) {
      throw new ConflictException(`A subcategory with slug '${dto.slug}' already exists`)
    }

    return this.prisma.client.subcategory.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        image: dto.image,
        categoryId: category.id,
      },
    })
  }

  async updateSubcategory(categorySlug: string, subSlug: string, dto: UpdateSubcategoryDto) {
    await this.findOneCategory(categorySlug)

    const subcategory = await this.prisma.client.subcategory.findUnique({
      where: { slug: subSlug },
    })

    if (!subcategory) {
      throw new NotFoundException(`Subcategory '${subSlug}' not found`)
    }

    if (dto.slug && dto.slug !== subSlug) {
      const slugTaken = await this.prisma.client.subcategory.findUnique({
        where: { slug: dto.slug },
      })

      if (slugTaken) {
        throw new ConflictException(`A subcategory with slug '${dto.slug}' already exists`)
      }
    }

    return this.prisma.client.subcategory.update({
      where: { slug: subSlug },
      data: {
        name: dto.name,
        slug: dto.slug,
        image: dto.image,
      },
    })
  }

  async deleteSubcategory(categorySlug: string, subSlug: string) {
    await this.findOneCategory(categorySlug)

    const subcategory = await this.prisma.client.subcategory.findUnique({
      where: { slug: subSlug },
    })

    if (!subcategory) {
      throw new NotFoundException(`Subcategory '${subSlug}' not found`)
    }

    await this.prisma.client.subcategory.delete({
      where: { slug: subSlug },
    })

    return { message: `Subcategory '${subSlug}' deleted successfully` }
  }
}
