import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cart } from './cart.entity';
import { UserRole } from '../enums/user-role.enum';
import { Favorite } from './favorite.entity';
import { UserStatus } from '../enums/user-status.enum';
import { Review } from './review.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'text', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  reviews: Review[];

  @Column({ type: 'text', enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  @OneToMany(() => Favorite, (favorite) => favorite.user, { cascade: true })
  favorites: Favorite[];

  @Column('text', { nullable: true })
  refreshToken?: string | null;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @Column('text', { nullable: true })
  resetPasswordToken?: string | null;

  @Column('datetime', { nullable: true })
  resetPasswordExpires?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (
      this.password &&
      !this.password.startsWith('$2b$') &&
      !this.password.startsWith('$2a$')
    ) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
