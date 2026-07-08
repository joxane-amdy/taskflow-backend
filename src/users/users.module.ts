import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({

  // Rend l'entité User disponible via TypeORM
  imports: [
    TypeOrmModule.forFeature([User]),
  ],

  // Déclaration du service
  providers: [
    UsersService,
  ],

  // Déclaration du contrôleur
  controllers: [
    UsersController,
  ],

  // Export du service
  // Permet à AuthModule d'utiliser UsersService
  exports: [
    UsersService,
  ],
})
export class UsersModule {}
