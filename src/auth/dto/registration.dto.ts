import { LoginDto } from './login.dto';

export class RegistrationDto extends LoginDto {
  firstName: string;
  lastName: string;
}
