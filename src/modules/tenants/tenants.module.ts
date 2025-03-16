import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { Tenant } from './tenants.entity';
import { TenantsController } from './tenants.controller';
import { Role } from '../roles/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, Role])],
  providers: [TenantsService],
  controllers: [TenantsController],
  exports: [TenantsService],
})
export class TenantsModule {}
