import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequis = this.reflector.get<string[]>('roles', context.getHandler());

    // Pas de @Roles() sur la route = accessible à tous les connectés
    if (!rolesRequis) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!rolesRequis.includes(user.role)) {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    return true;
  }
}
