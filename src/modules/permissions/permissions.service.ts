import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './permissions.entity';
import { Role } from '../roles/roles.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
    callerRole: string,
  ): Promise<Permission> {
    // Chỉ role "super" mới được tạo permission
    if (callerRole !== 'super') {
      throw new UnauthorizedException(
        'Only super users can create permissions',
      );
    }

    const permission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
    callerRole: string,
  ): Promise<Permission> {
    if (callerRole !== 'super') {
      throw new UnauthorizedException(
        'Only super users can update permissions',
      );
    }

    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission)
      throw new NotFoundException(`Permission with ID ${id} not found`);

    Object.assign(permission, updatePermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async delete(id: number, callerRole: string): Promise<void> {
    if (callerRole !== 'super') {
      throw new UnauthorizedException(
        'Only super users can delete permissions',
      );
    }

    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission)
      throw new NotFoundException(`Permission with ID ${id} not found`);

    await this.permissionsRepository.remove(permission);
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

  async findAll(
    pagination: PaginationDto,
  ): Promise<{ data: Permission[]; total: number }> {
    const { page, limit }: any = pagination;
    const [data, total] = await this.permissionsRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findByUserRoles(userRoles: Role[]): Promise<Permission[]> {
    const roleIds = userRoles.map((role) => role.id);

    const roles = await this.rolesRepository.find({
      where: { id: In(roleIds) },
      relations: ['permissions'],
    });

    // Gộp tất cả permissions từ các role, loại bỏ trùng lặp
    const permissions = roles.reduce((acc, role) => {
      role.permissions.forEach((perm) => {
        if (!acc.some((p) => p.id === perm.id)) {
          acc.push(perm);
        }
      });
      return acc;
    }, [] as Permission[]);

    return permissions;
  }
}
