import { IsNotEmpty } from 'class-validator';

export class CreatePremisesDto {
  id?: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  slug: string;
}
