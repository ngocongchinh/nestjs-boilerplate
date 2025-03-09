import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.phone_number = createUserDto.phoneNumber || '';
    if (createUserDto.tenant) {
      user.tenant = createUserDto.tenant;
    }
    if (createUserDto.roles) {
      user.roles = createUserDto.roles;
    }
    await user.hashPassword();
    return this.usersRepository.save(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tenantId: number,
  ): Promise<User> {
    const user = await this.findOne(id, tenantId);
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
      await user.hashPassword();
    }
    Object.assign(user, updateUserDto);
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
