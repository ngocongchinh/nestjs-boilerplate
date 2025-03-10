import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenants/tenants.entity';
import { User } from '../users/users.entity';

@Entity('uploaded_images')
export class UploadedImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string; // URL của ảnh sau khi upload

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  createdBy: User;

  @Column({ name: 'tenant_id' })
  tenantId: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.id)
  tenant: Tenant;
}
