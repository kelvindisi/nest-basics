import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { LoginDto, RegistrationDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: RegistrationDto) {
    dto.password = await argon.hash(dto.password);

    const user = await this.prisma.user
      .create({
        data: { ...dto },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code == 'P2002')
            throw new NotAcceptableException(
              'user with that email already exists',
            );
        }

        throw new BadRequestException(error.message);
      });

    return user;
  }

  async signIn(dto: LoginDto) {
    return dto;
  }
}
