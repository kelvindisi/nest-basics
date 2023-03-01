import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth-guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  @Roles(Role.ADMIN)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
