import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, RegistrationDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

    return this.signToken(user.id, user.email);
  }

  async signIn(dto: LoginDto) {
    const user = await this.prisma.user
      .findUnique({
        where: {
          email: dto.email,
        },
      })
      .then(async (data) => {
        const pwVerified = argon.verify(data.password, dto.password);
        if (!pwVerified) {
          throw new UnauthorizedException('wrong login credentials');
        }
        return data;
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: email,
      id: userId,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('TOKEN_EXPIRES_IN'),
      secret: this.config.get('SIGNING_SECRET'),
    });

    return { access_token: token };
  }
}
