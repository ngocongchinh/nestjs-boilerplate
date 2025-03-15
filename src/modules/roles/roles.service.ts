import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(name: string, description: string): Promise<Role> {
    const role = new Role();
    role.name = name;
    role.description = description;
    return this.rolesRepository.save(role);
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<{ data: Role[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.rolesRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error(`Permission with ID ${id} not found`);
    }
    return role;
  }

  async findByName(name: string): Promise<Role> {
    const res = await this.rolesRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
    if (!res) {
      throw new Error(`Error`);
    }
    return res;
  }
}
