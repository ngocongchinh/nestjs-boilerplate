import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permissions.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(name: string, description: string): Promise<Permission> {
    const permission = new Permission();
    permission.name = name;
    permission.description = description;
    return this.permissionsRepository.save(permission);
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new Error(`Permission with ID ${id} not found`);
    }
    return permission;
  }
}
