import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tenant } from '../tenants/tenants.entity';
import { Permission } from '../permissions/permissions.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.roles)
  tenant: Tenant;

  @Column({ name: 'tenant_id', nullable: true })
  tenantId: number;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_permissions_permission' })
  permissions: Permission[];
}
