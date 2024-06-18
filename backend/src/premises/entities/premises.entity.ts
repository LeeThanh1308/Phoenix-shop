import { Accounts } from 'src/accounts/entities/account.entity';
import { Products } from 'src/products/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  JoinTable,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity({ name: 'premises' })
export class Premises {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  slug: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Accounts, (accounts) => accounts.premise)
  manage: Accounts;

  @OneToMany(() => Accounts, (accounts) => accounts.premises)
  staff: Accounts[];

  @ManyToMany(() => Products, (products) => products.premises)
  @JoinTable()
  products: Products[];
}
