import { Accounts } from 'src/accounts/entities/account.entity';
import { ProductType } from 'src/product_types/entities/product_type.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'solds' })
export class Sold {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  price: number;

  @Column()
  address: string;

  @Column({ nullable: false })
  method: string;

  @Column()
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Accounts, (accounts) => accounts.solds)
  @JoinColumn()
  account: Accounts;

  @ManyToOne(() => ProductType, (type) => type.solds)
  @JoinColumn()
  type: ProductType;
}
