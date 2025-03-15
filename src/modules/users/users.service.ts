import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Role } from '../roles/roles.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}
  async findAllByTenant(
    tenantId: number,
    pagination: PaginationDto,
    userRole: string,
  ): Promise<{ data: User[]; total: number }> {
    const { page, limit }: any = pagination;
    // Nếu user có role "super", trả về tất cả user
    if (userRole === 'super') {
      const [data, total] = await this.usersRepository.findAndCount({
        select: [
          'id',
          'email',
          'name',
          'phone_number',
          'status',
          'created_at',
          'updated_at',
          'tenantId',
        ],
        relations: ['tenant', 'roles'], // Bao gồm cả role nếu cần
        take: limit,
        skip: (page - 1) * limit,
      });
      return { data, total };
    }

    const [data, total] = await this.usersRepository.findAndCount({
      where: { tenantId },
      select: [
        'id',
        'email',
        'name',
        'phone_number',
        'status',
        'created_at',
        'updated_at',
        'tenantId',
      ], // Loại bỏ password
      relations: ['tenant', 'roles'], // Nếu muốn trả về thông tin tenant
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number, tenantId: number): Promise<User> {
    const res = await this.usersRepository.findOne({
      where: { id, tenantId },
      relations: ['roles', 'tenant'],
    });

    if (!res) {
      throw new Error(` ${id} not found`);
    }

    return res;
  }

  async findByEmail(email: string, tenantId?: number): Promise<User> {
    const where = tenantId ? { email, tenantId } : { email };
    const res = await this.usersRepository.findOne({
      where,
      relations: ['roles', 'tenant'],
    });

    if (!res) {
      throw new Error(` ${email} not found`);
    }

    return res;
  }

  async findByProvider(
    provider: string,
    providerId: string,
    tenantId: number,
  ): Promise<User> {
    const res = await this.usersRepository.findOne({
      where: { provider, provider_id: providerId, tenantId },
      relations: ['roles', 'tenant'],
    });

    if (!res) {
      throw new Error(`Error`);
    }

    return res;
  }

  async create(createUserDto: CreateUserDto, tenantId: number): Promise<User> {
    const { password, roleIds, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lấy danh sách roles từ roleIds
    const roles = await this.rolesRepository.find({
      where: roleIds.map((id) => ({ id })),
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more role IDs not found');
    }

    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
      tenantId,
      roles,
    });

    return this.usersRepository.save(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tenantId: number,
  ): Promise<User> {
    const { roleIds } = updateUserDto;

    // Lấy danh sách roles từ roleIds
    const roles = await this.rolesRepository.find({
      where: roleIds.map((id) => ({ id })),
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more role IDs not found');
    }

    const user = await this.findOne(id, tenantId);
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
      await user.hashPassword();
    }
    Object.assign(user, { ...updateUserDto, roles });
    return this.usersRepository.save(user);
  }

  async createOrUpdateSocialUser(
    profile: any,
    provider: string,
    tenantId: number,
  ): Promise<User> {
    const email = profile.emails?.[0]?.value;
    const providerId = profile.id;
    let user = await this.findByProvider(provider, providerId, tenantId);

    if (!user && email) {
      user = await this.findByEmail(email, tenantId);
    }

    if (!user) {
      user = new User();
      user.email = email;
      user.name =
        profile.displayName ||
        profile.name?.givenName + ' ' + profile.name?.familyName;
      user.avatar = profile.photos?.[0]?.value;
      user.provider = provider;
      user.provider_id = providerId;
      user.tenantId = tenantId;
      return this.usersRepository.save(user);
    } else {
      user.name =
        profile.displayName ||
        profile.name?.givenName + ' ' + profile.name?.familyName;
      user.avatar = profile.photos?.[0]?.value;
      user.provider = provider;
      user.provider_id = providerId;
      return this.usersRepository.save(user);
    }
  }
}
