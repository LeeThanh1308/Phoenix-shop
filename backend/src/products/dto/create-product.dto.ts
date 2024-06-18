import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  barcode: number;

  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  nsx: Date;
  @IsNotEmpty()
  hsd: Date;

  category: number;

  image: string[];

  premise_id?: number;
}
