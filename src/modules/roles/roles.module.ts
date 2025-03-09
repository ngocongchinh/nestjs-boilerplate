import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './roles.entity';
import { TenantsModule } from '../tenants/tenants.module'; // Import TenantsModule

@Module({
  imports: [TypeOrmModule.forFeature([Role]), TenantsModule],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
