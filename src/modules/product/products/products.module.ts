import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './products.entity';
import { ProductSuppliersModule } from '../suppliers/product-suppliers.module';
import { ProductImagesModule } from '../images/product-images.module';
import { UploadImagesModule } from '../../upload-images/upload-images.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductSuppliersModule,
    ProductImagesModule,
    UploadImagesModule,
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
