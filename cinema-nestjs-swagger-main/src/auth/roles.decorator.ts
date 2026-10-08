import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const ADMIN = 'ADMIN';
export const CLIENTE = 'CLIENTE';

// Restringe a rota (ou controller inteiro) aos papéis informados
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
