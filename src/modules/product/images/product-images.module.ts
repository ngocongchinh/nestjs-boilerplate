import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImagesService } from './product-images.service';
import { ProductImagesController } from './product-images.controller';
import { ProductImage } from './product-images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])],
  providers: [ProductImagesService],
  controllers: [ProductImagesController],
  exports: [ProductImagesService],
})
export class ProductImagesModule {}
