import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './product-attributes.entity';
import { CreateProductAttributeDto } from './dtos/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dtos/update-product-attribute.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { User } from '../../users/users.entity';

@Injectable()
export class ProductAttributesService {
  constructor(
    @InjectRepository(ProductAttribute)
    private attributesRepository: Repository<ProductAttribute>,
  ) {}

  async create(
    createDto: CreateProductAttributeDto,
    tenantId: number,
    createdBy: User,
  ): Promise<ProductAttribute> {
    const attribute = this.attributesRepository.create({
      ...createDto,
      tenantId,
      createdBy,
    });
    return this.attributesRepository.save(attribute);
  }

  async findAll(
    tenantId: number,
    pagination: PaginationDto,
  ): Promise<{ data: ProductAttribute[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.attributesRepository.findAndCount({
      where: { tenantId },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number, tenantId: number): Promise<ProductAttribute> {
    const attribute = await this.attributesRepository.findOne({
      where: { id, tenantId },
    });
    if (!attribute)
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    return attribute;
  }

  async update(
    id: number,
    updateDto: UpdateProductAttributeDto,
    tenantId: number,
  ): Promise<ProductAttribute> {
    const attribute = await this.findOne(id, tenantId);
    Object.assign(attribute, updateDto);
    return this.attributesRepository.save(attribute);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const attribute = await this.findOne(id, tenantId);
    await this.attributesRepository.remove(attribute);
  }
}
