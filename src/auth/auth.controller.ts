import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  signUp(@Body() dto: RegistrationDto) {
    this.authService.signUp(dto);
  }

  @Post('login')
  signIn(@Body() dto: LoginDto) {
    return this.authService.signIn(dto);
  }
}
