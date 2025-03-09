import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(name: string, tenantId: number): Promise<Role> {
    const role = new Role();
    role.name = name;
    role.tenantId = tenantId;
    return this.rolesRepository.save(role);
  }

  async findOne(id: number, tenantId: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id, tenantId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error(`Permission with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string, tenantId: number): Promise<Role> {
    const res = await this.rolesRepository.findOne({
      where: { name, tenantId },
      relations: ['permissions'],
    });
    if (!res) {
      throw new Error(`Error`);
    }
    return res;
  }
}
