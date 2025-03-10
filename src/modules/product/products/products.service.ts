import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './products.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { User } from '../../users/users.entity';
import { ProductSuppliersService } from '../suppliers/product-suppliers.service';
import { ProductImagesService } from '../images/product-images.service';
import { ProductSupplier } from '../suppliers/product-suppliers.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private suppliersService: ProductSuppliersService,
    private imagesService: ProductImagesService,
  ) {}

  async create(
    createDto: CreateProductDto,
    tenantId: number,
    createdBy: User,
  ): Promise<Product> {
    const suppliers: ProductSupplier[] = await Promise.all(
      createDto.suppliers.map((id) =>
        this.suppliersService.findOne(id, tenantId),
      ),
    );
    // Tạo product entity mà không gán suppliers ngay
    const product = this.productsRepository.create({
      name: createDto.name,
      slug: createDto.slug,
      categoryId: createDto.categoryId,
      brandId: createDto.brandId,
      price: createDto.price,
      shortDescription: createDto.shortDescription,
      description: createDto.description,
      status: createDto.status,
      tenantId,
      createdBy,
    });

    // Gán suppliers sau khi tạo
    product.suppliers = suppliers;

    // Lưu product vào database
    const savedProduct = await this.productsRepository.save(product);

    // Thêm images nếu có
    if (createDto.images && createDto.images.length > 0) {
      for (const src of createDto.images) {
        await this.imagesService.create(
          src,
          savedProduct.id,
          tenantId,
          createdBy,
        );
      }
    }
    return savedProduct;
  }

  async findAll(
    tenantId: number,
    pagination: PaginationDto,
  ): Promise<{ data: Product[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.productsRepository.findAndCount({
      where: { tenantId },
      relations: ['category', 'brand', 'suppliers', 'images'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number, tenantId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, tenantId },
      relations: ['category', 'brand', 'suppliers', 'images'],
    });
    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  async update(
    id: number,
    updateDto: UpdateProductDto,
    tenantId: number,
  ): Promise<Product> {
    const product = await this.findOne(id, tenantId);
    if (updateDto.suppliers) {
      product.suppliers = await Promise.all(
        updateDto.suppliers.map((id) =>
          this.suppliersService.findOne(id, tenantId),
        ),
      );
    }
    if (updateDto.images) {
      // Xóa images cũ và thêm mới
      await this.imagesService.remove(id, tenantId); // Giả sử xóa tất cả ảnh của product
      for (const src of updateDto.images) {
        await this.imagesService.create(
          src,
          product.id,
          tenantId,
          product.createdBy,
        );
      }
    }
    Object.assign(product, updateDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const product = await this.findOne(id, tenantId);
    await this.productsRepository.remove(product);
  }
}
