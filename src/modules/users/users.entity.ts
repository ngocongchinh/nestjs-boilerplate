import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from '../tenants/tenants.entity';
import { Role } from '../roles/roles.entity';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'boolean', default: false })
  isActivated: boolean;

  @Column({ nullable: true })
  activationToken?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  provider_id: string;

  @Column({ default: false })
  is_two_factor_enabled: boolean;

  @Column({ default: false })
  is_locked: boolean;

  @Column({ nullable: true })
  two_factor_secret: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  tenant: Tenant;

  @Column({ name: 'tenant_id', nullable: true })
  tenantId: number;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles_roles' })
  roles: Role[];

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
