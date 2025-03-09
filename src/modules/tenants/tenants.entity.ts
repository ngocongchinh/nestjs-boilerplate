import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';
import { Permission } from '../permissions/permissions.entity';

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Role, (role) => role.tenant)
  roles: Role[];

  @OneToMany(() => Permission, (permission) => permission.tenant)
  permissions: Permission[];
}
