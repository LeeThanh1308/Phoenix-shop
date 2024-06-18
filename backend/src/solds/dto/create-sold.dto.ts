import { IsNotEmpty } from 'class-validator';

export class CreateSoldDto {
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  method: string;

  @IsNotEmpty()
  note: string;

  address?: string;
}
