import { SetMetadata } from '@nestjs/common';

// Usage : @Roles('admin') au-dessus d'une route
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
