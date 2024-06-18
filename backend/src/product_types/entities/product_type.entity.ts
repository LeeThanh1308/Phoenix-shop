import { Cart } from 'src/carts/entities/cart.entity';
import { Products } from 'src/products/entities/product.entity';
import { Sold } from 'src/solds/entities/sold.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product_type' })
export class ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  price: number;

  @Column()
  cost: number;

  @Column()
  discount: number;

  @Column()
  quantity: number;

  @OneToMany(() => Sold, (sold) => sold.type)
  solds: Sold[];

  @ManyToOne(() => Products, (products) => products.type, { onDelete: 'CASCADE' })
  @JoinColumn()
  products: Products;

  @ManyToOne(() => Cart, (cart) => cart.type, { onDelete: 'CASCADE' })
  cart: Cart[];
}
