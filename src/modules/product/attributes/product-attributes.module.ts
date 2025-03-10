import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributesService } from './product-attributes.service';
import { ProductAttributesController } from './product-attributes.controller';
import { ProductAttribute } from './product-attributes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAttribute])],
  providers: [ProductAttributesService],
  controllers: [ProductAttributesController],
  exports: [ProductAttributesService],
})
export class ProductAttributesModule {}
