import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { TenantsModule } from '../tenants/tenants.module';
import { Role } from '../roles/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), TenantsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
