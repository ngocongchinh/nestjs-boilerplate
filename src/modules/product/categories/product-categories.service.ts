import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-categories.entity';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { User } from '../../users/users.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private categoriesRepository: Repository<ProductCategory>,
  ) {}

  async create(
    createDto: CreateProductCategoryDto,
    tenantId: number,
    createdBy: User,
  ): Promise<ProductCategory> {
    const category = this.categoriesRepository.create({
      ...createDto,
      tenantId,
      createdBy,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(
    tenantId: number,
    pagination: PaginationDto,
  ): Promise<{ data: ProductCategory[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.categoriesRepository.findAndCount({
      where: { tenantId },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number, tenantId: number): Promise<ProductCategory> {
    const category = await this.categoriesRepository.findOne({
      where: { id, tenantId },
    });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async update(
    id: number,
    updateDto: UpdateProductCategoryDto,
    tenantId: number,
  ): Promise<ProductCategory> {
    const category = await this.findOne(id, tenantId);
    Object.assign(category, updateDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const category = await this.findOne(id, tenantId);
    await this.categoriesRepository.remove(category);
  }
}
