import { Cart } from 'src/carts/entities/cart.entity';
import { Premises } from 'src/premises/entities/premises.entity';
import { Roles } from 'src/roles/entities/role.entity';
import { Sold } from 'src/solds/entities/sold.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'accounts' })
export class Accounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  fullname: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: false, type: 'enum', enum: ['x', 'y', 'z'] })
  gender: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: false, type: 'date' })
  birthday: Date;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: false, type: 'boolean', default: false })
  ban: boolean;

  @Column({ nullable: false, unique: true })
  usid: string;

  @Column({ nullable: true, type: 'text' })
  refresh_token?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Roles, (roles) => roles.accounts)
  @JoinColumn()
  roles: Roles;

  @OneToOne(() => Premises, (premises) => premises.manage)
  @JoinColumn()
  premise: Premises;

  @ManyToOne(() => Premises, (premises) => premises.staff)
  @JoinColumn()
  premises: Premises[];

  @OneToMany(() => Cart, (cart) => cart.account)
  cart: Cart[];

  @OneToMany(() => Sold, (sold) => sold.account)
  solds?: Sold[];
}
