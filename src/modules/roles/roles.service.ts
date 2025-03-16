import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './roles.entity';
import { Permission } from '../permissions/permissions.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createRoleDto: CreateRoleDto, tenantId: number): Promise<Role> {
    const { permissionIds, ...rest } = createRoleDto;

    const permissions = await this.permissionsRepository.find({
      where: { id: In(permissionIds) },
    });
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permission IDs not found');
    }

    const role = this.rolesRepository.create({
      ...rest,
      tenantId,
      permissions,
    });

    return this.rolesRepository.save(role);
  }

  async update(
    id: number,
    tenantId: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const role = await this.findOne(id, tenantId);
    const { permissionIds, ...rest } = updateRoleDto;

    if (permissionIds) {
      const permissions = await this.permissionsRepository.find({
        where: { id: In(permissionIds) },
      });
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('One or more permission IDs not found');
      }
      role.permissions = permissions;
    }

    Object.assign(role, rest);
    return this.rolesRepository.save(role);
  }

  async findAll(
    tenantId: number,
    pagination: PaginationDto,
  ): Promise<{ data: Role[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.rolesRepository.findAndCount({
      where: { tenantId },
      relations: ['permissions'],
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number, tenantId: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id, tenantId },
      relations: ['permissions'],
    });
    if (!role)
      throw new NotFoundException(
        `Role with ID ${id} not found in this tenant`,
      );
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
