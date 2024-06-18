import { Accounts } from 'src/accounts/entities/account.entity';
import { ProductType } from 'src/product_types/entities/product_type.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Accounts, (accounts) => accounts.cart)
  @JoinColumn()
  account: Accounts;

  @ManyToOne(() => ProductType, (productType) => productType.cart)
  @JoinColumn()
  type: ProductType;
}
