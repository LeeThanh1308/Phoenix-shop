import { IsNotEmpty } from 'class-validator';

export class CreateSliderDto {
  imageUrl: string;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  description: string;
}
