import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Tenant } from '../tenants/tenants.entity';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.permissions)
  tenant: Tenant;

  @Column({ name: 'tenant_id', nullable: true }) // Thêm cột tenant_id
  tenantId: number;
}
