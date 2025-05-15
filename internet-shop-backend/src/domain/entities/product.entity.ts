import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategory } from '../enums/product-category.enum';
import { Favorite } from './favorite.entity';
import { ProductStatus } from '../enums/product-status.enum';
import { Review } from './review.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('decimal')
  price: number;

  @Column('int')
  stock: number;

  @Column({ type: 'text', enum: ProductCategory })
  category: ProductCategory;

  @Column({ type: 'text', enum: ProductStatus, default: ProductStatus.Active })
  status: ProductStatus;

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.product, { cascade: true })
  favorites: Favorite[];

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column('float', { nullable: true })
  rating?: number;

  @Column('int', { default: 0 })
  reviewsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
