import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { User } from './modules/users/users.entity';
import { Role } from './modules/roles/roles.entity';
import { Permission } from './modules/permissions/permissions.entity';
import { Tenant } from './modules/tenants/tenants.entity';
import {
  ProductSuppliersModule,
  ProductBrandsModule,
  ProductCategoriesModule,
  ProductAttributesModule,
  ProductImagesModule,
  ProductsModule,
} from './modules/product';
import { UploadImagesModule } from './modules/upload-images/upload-images.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Role, Permission, Tenant],
        synchronize: true, // Chỉ dùng trong dev
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    TenantsModule,
    ProductSuppliersModule,
    ProductBrandsModule,
    ProductCategoriesModule,
    ProductAttributesModule,
    ProductImagesModule,
    ProductsModule,
    UploadImagesModule,
  ],
})
export class AppModule {}
