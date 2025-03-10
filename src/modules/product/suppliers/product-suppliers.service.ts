import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSupplier } from './product-suppliers.entity';
import { CreateProductSupplierDto } from './dtos/create-product-supplier.dto';
import { UpdateProductSupplierDto } from './dtos/update-product-supplier.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { User } from '../../users/users.entity';

@Injectable()
export class ProductSuppliersService {
  constructor(
    @InjectRepository(ProductSupplier)
    private suppliersRepository: Repository<ProductSupplier>,
  ) {}

  async create(
    createDto: CreateProductSupplierDto,
    tenantId: number,
    createdBy: User,
  ): Promise<ProductSupplier> {
    const supplier = this.suppliersRepository.create({
      ...createDto,
      tenantId,
      createdBy,
    });
    return this.suppliersRepository.save(supplier);
  }

  async findAll(
    tenantId: number,
    pagination: PaginationDto,
  ): Promise<{ data: ProductSupplier[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.suppliersRepository.findAndCount({
      where: { tenantId },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number, tenantId: number): Promise<ProductSupplier> {
    const supplier = await this.suppliersRepository.findOne({
      where: { id, tenantId },
    });
    if (!supplier)
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    return supplier;
  }

  async update(
    id: number,
    updateDto: UpdateProductSupplierDto,
    tenantId: number,
  ): Promise<ProductSupplier> {
    const supplier = await this.findOne(id, tenantId);
    Object.assign(supplier, updateDto);
    return this.suppliersRepository.save(supplier);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const supplier = await this.findOne(id, tenantId);
    await this.suppliersRepository.remove(supplier);
  }
}
