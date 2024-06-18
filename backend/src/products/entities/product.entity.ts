import { Category } from 'src/categories/entities/category.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { ProductsPremise } from 'src/products_premise/entities/products_premise.entity';
import { ProductType } from 'src/product_types/entities/product_type.entity';
import { Premises } from 'src/premises/entities/premises.entity';

@Entity({ name: 'products' })
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false })
  barcode: number;

  @Column({ type: 'simple-json', nullable: false })
  image: string[];

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: false })
  nsx: Date;

  @Column({ nullable: false })
  hsd: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @OneToMany(() => ProductType, (productType) => productType.products, { onDelete: 'CASCADE' })
  type: ProductType[];

  @OneToMany(() => ProductsPremise, (productsPremise) => productsPremise.product)
  products_premise?: ProductsPremise[];

  @ManyToMany(() => Premises, (premises) => premises.products)
  premises?: Premises[];
}
