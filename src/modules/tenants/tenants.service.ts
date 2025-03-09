import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenants.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) {}

  async create(name: string): Promise<Tenant> {
    const tenant = new Tenant();
    tenant.name = name;
    return this.tenantsRepository.save(tenant);
  }

  async findOne(id: number): Promise<Tenant> {
    const res = await this.tenantsRepository.findOne({
      where: { id },
    });

    if (!res) {
      throw new Error(`Permission with ID ${id} not found`);
    }
    return res;
  }

  async findByName(name: string): Promise<Tenant> {
    const res = await this.tenantsRepository.findOne({
      where: { name },
    });

    if (!res) {
      throw new Error(` ${name} not found`);
    }

    return res;
  }
}
