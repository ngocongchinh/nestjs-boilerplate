import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBrandsService } from './product-brands.service';
import { ProductBrandsController } from './product-brands.controller';
import { ProductBrand } from './product-brands.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductBrand])],
  providers: [ProductBrandsService],
  controllers: [ProductBrandsController],
  exports: [ProductBrandsService],
})
export class ProductBrandsModule {}
