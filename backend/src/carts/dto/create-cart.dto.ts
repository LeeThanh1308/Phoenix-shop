import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  type: number;
}
