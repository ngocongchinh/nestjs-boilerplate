import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSuppliersService } from './product-suppliers.service';
import { ProductSuppliersController } from './product-suppliers.controller';
import { ProductSupplier } from './product-suppliers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSupplier])],
  providers: [ProductSuppliersService],
  controllers: [ProductSuppliersController],
  exports: [ProductSuppliersService],
})
export class ProductSuppliersModule {}
