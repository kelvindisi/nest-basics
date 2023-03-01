import { Injectable } from '@nestjs/common';
import { LoginDto, RegistrationDto } from './dto';

@Injectable()
export class AuthService {
  async signUp(dto: RegistrationDto) {
    return dto;
  }

  async signIn(dto: LoginDto) {
    return dto;
  }
}
