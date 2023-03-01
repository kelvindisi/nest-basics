import { IsOptional, IsString } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegistrationDto extends LoginDto {
  @IsString()
  @IsOptional()
  firstName: string;
  @IsString()
  @IsOptional()
  lastName: string;
}
