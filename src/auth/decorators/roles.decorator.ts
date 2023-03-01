import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'roles';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export const Roles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);
