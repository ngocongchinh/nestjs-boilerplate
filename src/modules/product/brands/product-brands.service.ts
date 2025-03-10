import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductBrand } from './product-brands.entity';
import { CreateProductBrandDto } from './dtos/create-product-brand.dto';
import { UpdateProductBrandDto } from './dtos/update-product-brand.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { User } from '../../users/users.entity';

@Injectable()
export class ProductBrandsService {
  constructor(
    @InjectRepository(ProductBrand)
    private brandsRepository: Repository<ProductBrand>,
  ) {}

  async create(
    createDto: CreateProductBrandDto,
    tenantId: number,
    createdBy: User,
  ): Promise<ProductBrand> {
    const brand = this.brandsRepository.create({
      ...createDto,
      tenantId,
      createdBy,
    });
    return this.brandsRepository.save(brand);
  }

  async findAll(
    tenantId: number,
    pagination: PaginationDto,
  ): Promise<{ data: ProductBrand[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.brandsRepository.findAndCount({
      where: { tenantId },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number, tenantId: number): Promise<ProductBrand> {
    const brand = await this.brandsRepository.findOne({
      where: { id, tenantId },
    });
    if (!brand) throw new NotFoundException(`Brand with ID ${id} not found`);
    return brand;
  }

  async update(
    id: number,
    updateDto: UpdateProductBrandDto,
    tenantId: number,
  ): Promise<ProductBrand> {
    const brand = await this.findOne(id, tenantId);
    Object.assign(brand, updateDto);
    return this.brandsRepository.save(brand);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const brand = await this.findOne(id, tenantId);
    await this.brandsRepository.remove(brand);
  }
}
