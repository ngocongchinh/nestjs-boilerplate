import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './product-images.entity';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { User } from '../../users/users.entity';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private imagesRepository: Repository<ProductImage>,
  ) {}

  async create(
    src: string,
    productId: number,
    tenantId: number,
    createdBy: User,
  ): Promise<ProductImage> {
    const image = this.imagesRepository.create({
      src,
      productId,
      tenantId,
      createdBy,
    });
    return this.imagesRepository.save(image);
  }

  async findAll(
    productId: number,
    tenantId: number,
    pagination: PaginationDto,
  ): Promise<{ data: ProductImage[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.imagesRepository.findAndCount({
      where: { productId, tenantId },
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number, tenantId: number): Promise<ProductImage> {
    const image = await this.imagesRepository.findOne({
      where: { id, tenantId },
    });
    if (!image) throw new NotFoundException(`Image with ID ${id} not found`);
    return image;
  }

  async remove(id: number, tenantId: number): Promise<void> {
    const image = await this.findOne(id, tenantId);
    await this.imagesRepository.remove(image);
  }
}
