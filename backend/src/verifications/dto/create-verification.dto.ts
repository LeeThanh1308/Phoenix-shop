import { IsEmail, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';

export class CreateVerificationDto {
  @IsEmail()
  email: string;

  @IsNumber()
  code: number;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateAccountDto)
  data?: CreateAccountDto;

  forget_password?: boolean;
}
