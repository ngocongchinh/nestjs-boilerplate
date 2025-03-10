import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Tenant } from '../../tenants/tenants.entity';
import { User } from '../../users/users.entity';
import { ProductCategory } from '../categories/product-categories.entity';
import { ProductBrand } from '../brands/product-brands.entity';
import { ProductSupplier } from '../suppliers/product-suppliers.entity';
import { ProductImage } from '../images/product-images.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => ProductCategory, (category) => category.id)
  category: ProductCategory;

  @Column({ name: 'brand_id' })
  brandId: number;

  @ManyToOne(() => ProductBrand, (brand) => brand.id)
  brand: ProductBrand;

  @ManyToMany(() => ProductSupplier)
  @JoinTable()
  suppliers: ProductSupplier[];

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  mainImage?: string;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  review?: string;

  @Column({ nullable: true })
  metaTitle?: string;

  @Column({ type: 'text', nullable: true })
  metaDescription?: string;

  @Column({ nullable: true })
  metaKeyword?: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

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
